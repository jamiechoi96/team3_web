const NewVod = require('../models/newVodModel');
const SimilarVod = require('../models/similarVodModel');
const GenreVod = require('../models/genreVodModel');

exports.getNewVods = async (req, res) => {
  try {
    const newVods = await NewVod.getNewVods();
    res.json({ success: true, data: newVods });
  } catch (error) {
    console.error('신작 VOD 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

exports.getSimilarVods = async (req, res) => {
  try {
    const similarVods = await SimilarVod.getSimilarVods();
    res.json({ success: true, data: similarVods });
  } catch (error) {
    console.error('비슷한 VOD 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

exports.getGenreVods = async (req, res) => {
  try {
    const genreVods = await GenreVod.getGenreVods();
    res.json({ success: true, data: genreVods });
  } catch (error) {
    console.error('장르 기반 VOD 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};
