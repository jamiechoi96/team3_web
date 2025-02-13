const GenreVod = require('../models/genreVodModel');

exports.getGenreVods = async (req, res) => {
  try {
    const genreVods = await GenreVod.getGenreVods();
    res.json({ success: true, data: genreVods });
  } catch (error) {
    console.error('장르 기반 VOD 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};
