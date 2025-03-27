import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  enableOfflineQueue: false, // Tránh giữ lệnh khi mất kết nối
  retryStrategy: (times) => Math.min(times * 100, 2000), // Thử kết nối lại tối đa 2s
});

let isRedisConnected = false;

export const connectRedis = async () => {
  if (isRedisConnected) return redis;

  return new Promise((resolve, reject) => {
    redis.once('connect', () => {
      isRedisConnected = true;
      console.log('✅ Kết nối Redis thành công!');
      resolve(redis);
    });

    redis.once('error', (err) => {
      console.error('❌ Lỗi kết nối Redis:', err);
      reject(err);
    });
  });
};

export default redis;
