import request from 'supertest';
import app from '../src/index'; // asenda vastavalt kui sul app tuleb mujalt

describe('GET /occupations', () => {
  it('tagastab occupation listi', async () => {
    const res = await request(app).get('/occupations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
