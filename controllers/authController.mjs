import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.mjs';

dotenv.config();

export async function createAccessToken(req, res) {
    try {
      const { api_key, client_name, client_id } = req.body;
  
      if (!api_key) {
        return res.status(400).json({
          status: 'error',
          message: 'API key is required.'
        });
      }
  
      let rows = await db('firstoutcomes_tokens').where({ api_key, delete_flag: 'N' });
  
      if (rows.length === 0) {
        if (!client_name || !client_id) {
          return res.status(400).json({
            status: 'error',
            message: 'client_name and client_id are required to create a new token.'
          });
        }
  
        const [insertedId] = await db('firstoutcomes_token_api').insert({
          api_key,
          client_name,
          client_id,
          date_created: new Date(),
          delete_flag: 'N'
        });
  
        rows = await db('firstoutcomes_tokens').where({ id: insertedId });
      } else {
        const tokenExpiredAt = new Date(rows[0].token_expired_at);
        const currentTime = new Date();
  
        if (tokenExpiredAt <= currentTime) {
          // Token has expired — respond with refresh message
          return res.status(401).json({
            status: 'error',
            message: 'Access token has expired. Please use the refresh token to get a new one.'
          });
        }
      }
  
      // Token is still valid — return it
      const accessToken = jwt.sign(
        { clientId: rows[0].client_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRE }
      );
  
      const refreshToken = jwt.sign(
        { clientId: rows[0].client_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
      );
  
      const expiresInSec = parseInt(process.env.TOKEN_EXPIRE);
      const tokenExpiredAt = new Date(Date.now() + expiresInSec * 1000);
  
      await db('firstoutcomes_tokens')
        .where({ id: rows[0].id })
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expired_at: tokenExpiredAt,
          token_refreshed_at: new Date(),
          date_modified: new Date()
        });
  
      console.log("Access token generated successfully");
  
      return res.status(200).json({
        status: 'success',
        data: {
          access_token: accessToken,
          token_type: 'Bearer',
          token_expired_at: expiresInSec
        }
      });
  
    } catch (err) {
      console.error("Error in createAccessToken:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  }
  
  
export async function refreshAccessToken(req, res) {
    const { refresh_token } = req.body;
  
    if (!refresh_token) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required.'
      });
    }
  
    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
  
      // Fetch token record
      const rows = await db('firstoutcomes_tokens')
        .where({ client_id: decoded.clientId, delete_flag: 'N' });
  
      if (rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid or expired refresh token.'
        });
      }
  
      const tokenRecord = rows[0];
      const currentTime = new Date();
  
      // Check if access_token is not expired yet
      if (new Date(tokenRecord.token_expired_at) > currentTime) {
        return res.status(400).json({
          status: 'error',
          message: 'Access token is still valid. No need to refresh yet.'
        });
      }
  
      // Create new access token
      const newAccessToken = jwt.sign(
        { clientId: tokenRecord.client_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRE }
      );
  
      const expiresInSec = parseInt(process.env.TOKEN_EXPIRE);
      const tokenExpiredAt = new Date(Date.now() + expiresInSec * 1000);
  
      // Update DB
      await db('firstoutcomes_tokens')
        .where({ id: tokenRecord.id })
        .update({
          access_token: newAccessToken,
          token_expired_at: tokenExpiredAt,
          token_refreshed_at: new Date(),
          date_modified: new Date()
        });
  
      return res.status(200).json({
        status: 'success',
        data: {
          access_token: newAccessToken,
          token_type: 'Bearer',
          token_expired_at: process.env.REFRESH_TOKEN_EXPIRE
        }
      });
  
    } catch (err) {
      console.error("Error in refreshAccessToken:", err);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired refresh token.'
      });
    }
  }
  