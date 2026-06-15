-- =============================================
-- FindGym (파인드짐) 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. 프로필 테이블 (Supabase Auth users와 연결)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 헬스장 테이블
CREATE TABLE IF NOT EXISTS public.gyms (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('헬스', '요가', '필라테스', '크로스핏', '수영', '기타')),
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  price_info TEXT,
  facilities TEXT[],
  description TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 헬스장 후기 테이블
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  gym_id BIGINT REFERENCES public.gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 예약 테이블
CREATE TABLE IF NOT EXISTS public.reservations (
  id BIGSERIAL PRIMARY KEY,
  gym_id BIGINT REFERENCES public.gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reserved_date DATE NOT NULL,
  reserved_time TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  has_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 즐겨찾기 테이블
CREATE TABLE IF NOT EXISTS public.favorites (
  id BIGSERIAL PRIMARY KEY,
  gym_id BIGINT REFERENCES public.gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gym_id, user_id)
);

-- 6. 커뮤니티 게시글 테이블
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[],
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 게시글 좋아요 테이블
CREATE TABLE IF NOT EXISTS public.likes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- =============================================
-- RLS (Row Level Security) 정책
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "누구나 프로필 조회 가능" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "본인 프로필만 수정 가능" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "회원가입 시 프로필 생성" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- gyms (모든 사용자 조회, 관리자만 등록 - 여기서는 인증된 사용자도 등록 가능하게 설정)
CREATE POLICY "누구나 헬스장 조회 가능" ON public.gyms FOR SELECT USING (true);
CREATE POLICY "인증된 사용자 헬스장 등록" ON public.gyms FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- reviews
CREATE POLICY "누구나 후기 조회 가능" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "인증된 사용자 후기 작성" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 후기만 삭제 가능" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- reservations
CREATE POLICY "본인 예약만 조회 가능" ON public.reservations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "인증된 사용자 예약 생성" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 예약만 수정 가능" ON public.reservations FOR UPDATE USING (auth.uid() = user_id);

-- favorites
CREATE POLICY "본인 즐겨찾기 조회" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "인증된 사용자 즐겨찾기 추가" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 즐겨찾기 삭제" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- posts
CREATE POLICY "누구나 게시글 조회 가능" ON public.posts FOR SELECT USING (true);
CREATE POLICY "인증된 사용자 게시글 작성" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 게시글만 수정/삭제" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "본인 게시글만 삭제" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- comments
CREATE POLICY "누구나 댓글 조회 가능" ON public.comments FOR SELECT USING (true);
CREATE POLICY "인증된 사용자 댓글 작성" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 댓글만 삭제" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- likes
CREATE POLICY "누구나 좋아요 조회 가능" ON public.likes FOR SELECT USING (true);
CREATE POLICY "인증된 사용자 좋아요" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 좋아요만 취소" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 자동 트리거: 회원가입 시 profiles 생성
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, nickname)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'nickname', '익명')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 샘플 헬스장 데이터
-- =============================================

INSERT INTO public.gyms (name, category, address, lat, lng, phone, price_info, facilities, description, rating, review_count, image_urls) VALUES
('파워짐 강남점', '헬스', '서울 강남구 테헤란로 123', 37.4979, 127.0276, '02-1234-5678', '월 6만원 / 3개월 15만원', ARRAY['샤워실', '사우나', '주차장', '락커'], '강남 최대 규모의 헬스장! 최신 장비와 넓은 공간', 4.5, 128, ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600']),
('요가스튜디오 마음', '요가', '서울 마포구 홍익로 45', 37.5569, 126.9239, '02-9876-5432', '월 8만원 / 10회 7만원', ARRAY['샤워실', '요가매트 제공', '냉난방'], '마음이 편안해지는 요가 클래스', 4.8, 89, ARRAY['https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600']),
('필라테스 바디라인', '필라테스', '서울 서초구 방배로 67', 37.4816, 126.9969, '02-5555-1234', '월 12만원 / 10회 10만원', ARRAY['개인 레슨', '그룹 레슨', '주차'], '체형 교정 전문 필라테스 스튜디오', 4.7, 56, ARRAY['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600']),
('크로스핏 불꽃', '크로스핏', '서울 송파구 올림픽로 89', 37.5140, 127.1059, '02-7777-8888', '월 10만원', ARRAY['샤워실', '주차장', '개인 트레이닝'], '최고 강도의 크로스핏 훈련', 4.3, 201, ARRAY['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600']),
('수영장 아쿠아', '수영', '서울 영등포구 여의대로 11', 37.5247, 126.9244, '02-3333-4444', '월 5만원 / 10회 4만원', ARRAY['샤워실', '사우나', '어린이풀', '주차장'], '쾌적한 환경의 실내 수영장', 4.4, 167, ARRAY['https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600']),
('웰니스짐 홍대', '헬스', '서울 마포구 양화로 33', 37.5520, 126.9225, '02-2222-3333', '월 5만원 / 3개월 12만원', ARRAY['샤워실', 'PT가능', '락커'], '홍대 인근 가성비 헬스장', 4.1, 94, ARRAY['https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=600']);
