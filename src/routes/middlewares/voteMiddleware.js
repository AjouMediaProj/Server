/**
 * voteMiddleware.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const logger = require('@src/utils/logger');

/**
 * @class VoteMiddleware
 * @description
 */
class VoteMiddleware {
    constructor() {}

    async getVoteList(req, res) {
        const arr = [];
        arr.push({ id: 1, text: '26대 총학생회 선거!', date: '2121.10.11 ~ 2021.12.11!', category: '총학생회' });
        arr.push({ id: 2, text: '26대 총학생회 선거!!', date: '2121.10.11~2021.12.11!!', category: '총학생회' });
        arr.push({ id: 3, text: '자연과학대학2', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 4, text: '미디어학과', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 5, text: '경제학과', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 6, text: '금융공학과1', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 7, text: '자연과학대학3', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 8, text: '자연과학대학4', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 9, text: '자연과학대학5', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 10, text: '자연과학대학6', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 11, text: '금융공학과2', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 12, text: '금융공학과43', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 13, text: '금융공학과5', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 14, text: '금융공학과4', date: '2121.10.11~2021.12.11', category: '학과' });
        res.send(arr);
    }
}

/* Export instance as module */
module.exports = new VoteMiddleware();
