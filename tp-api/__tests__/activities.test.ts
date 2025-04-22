import request from 'supertest';
import app from '../src/index';

describe('GET /activities/search', () => {
  it('tagastab kõik tulemused, kui query on tühi', async () => {
    const res = await request(app).get('/activities/search?q=');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('filtreerib tulemused koodi või nime alusel', async () => {
    const res = await request(app).get('/activities/search?q=põllumajandus');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const activity of res.body) {
      const match =
        activity.name.toLowerCase().includes('põllumajandus') ||
        activity.code.toLowerCase().includes('põllumajandus');
      expect(match).toBe(true);
    }
  });

  it('tagastab tühja massiivi, kui midagi ei leita', async () => {
    const res = await request(app).get('/activities/search?q=xyzmidagiei');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
