from flask import Blueprint, request, session, jsonify
from app import db
from app.models import User, Party, PartyMember, RecommendationLog
from app.utils import login_required

# url_prefix는 유지하되, API 형태이므로 명확하게 전달
mypage_bp = Blueprint('mypage', __name__, url_prefix='/mypage')

@mypage_bp.route('/')
@login_required
def index():
    # 1. 원래 쓰던 변수명 그대로 데이터 가져오기
    user       = User.query.get_or_404(session['user_id'])
    my_parties = Party.query.join(PartyMember)\
                            .filter(PartyMember.user_id == user.user_id)\
                            .order_by(Party.created_at.desc()).limit(5).all()
    rec_logs   = RecommendationLog.query.filter_by(user_id=user.user_id)\
                                        .order_by(RecommendationLog.log_id.desc()).limit(10).all()
    liked_logs = [r for r in rec_logs if r.is_liked]
    
    # 2. render_template 대신 jsonify로 순수 데이터만 dict 형태로 리턴!
    return jsonify({
        "status": "success",
        "user": {
            "user_id": user.user_id,
            "nickname": user.nickname,
            "email": user.email,
            "allergies": user.allergies,
            "preferences": user.preferences,  # JSON 타입일 테니 그대로 들어감
            "manner_score": getattr(user, 'manner_score', 36.5)  # manner_score 필드 대응
        },
        "my_parties": [
            {
                "party_id": party.party_id,
                "title": party.title,
                "location": party.location,
                "status": party.status.value if party.status else "모집중",
                "meeting_time": party.meeting_time.strftime('%Y-%m-%d %H:%M') if party.meeting_time else None
            } for party in my_parties
        ],
        "liked_logs": [
            {
                "log_id": log.log_id,
                "recommended_menu": log.recommended_menu,
                "created_at": log.created_at.strftime('%Y-%m-%d %H:%M') if log.created_at else None
            } for log in liked_logs
        ]
    }), 200





@mypage_bp.route('/edit', methods=['POST'])  # JSON 통신 시 GET 페이지는 필요 없으므로 POST만 남김
@login_required
def edit():
    user = User.query.get_or_404(session['user_id'])
    
    # 프론트엔드에서 JSON 데이터로 넘어올 때 처리하는 방식 (request.get_json())
    data = request.get_json() if request.is_json else request.form
    
    nickname = data.get('nickname', '').strip()
    if nickname and nickname != user.nickname:
        if User.query.filter_by(nickname=nickname).first():
            return jsonify({"status": "error", "message": "이미 사용 중인 닉네임입니다."}), 400
        user.nickname = nickname
        session['nickname'] = nickname
        
    user.allergies = data.get('allergies', '')
    
    # 프론트엔드에서 배열 형태로 넘겨받기 처리
    user.preferences = {
        'likes': data.get('preferences', []),    # 리스트 데이터 받기
        'dislikes': data.get('dislikes', [])
    }
    
    db.session.commit()
    return jsonify({"status": "success", "message": "프로필이 수정되었습니다."}), 200