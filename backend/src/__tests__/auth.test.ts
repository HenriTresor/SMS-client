import request from 'supertest';

import app from '../app';
import { AuthService } from '../services/authService';

describe('Auth routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers a new user successfully', async () => {
    const registerSpy = jest.spyOn(AuthService, 'register').mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      password: 'hashed',
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        password: 'P@ssw0rd!1',
        deviceId: 'device-123',
        pushToken: 'ExponentPushToken[abc]'
      })
      .expect(201);

    expect(registerSpy).toHaveBeenCalled();
    expect(res.body).toEqual({
      message: 'User registered successfully',
      user: { id: 'user-id', email: 'user@example.com' },
    });
  });

  it('logins in successfully', async () => {
    const authResponse = {
      token: 'jwt-token',
      user: {
        id: 'user-id',
        email: 'user@example.com',
        balance: 100,
      },
    };
    const loginSpy = jest.spyOn(AuthService, 'login').mockResolvedValue(authResponse as any);

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'P@ssw0rd!1',
        deviceId: 'device-123',
      })
      .expect(200);

    expect(loginSpy).toHaveBeenCalled();
    expect(res.body).toEqual(authResponse);
  });

  it('returns 401 when login fails', async () => {
    jest.spyOn(AuthService, 'login').mockRejectedValue(new Error('Invalid password'));

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'wrong',
        deviceId: 'device-123',
      })
      .expect(401);

    expect(res.body).toEqual({ error: 'Invalid password' });
  });
});
