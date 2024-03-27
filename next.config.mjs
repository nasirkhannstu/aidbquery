// @ts-check

/**
 *  @type {import('next').NextConfig}
 */
const nextConfig = {
  redirects: async () => [
    {
      source: "/auth",
      destination: "/login",
      permanent: true,
    },
    {
      source: "/auth/login",
      destination: "/login",
      permanent: true,
    },
    {
      source: "/admin",
      destination: "/dashboard/users",
      permanent: true,
    },
    {
      source: "/control-panel",
      destination: "/dashboard/users",
      permanent: true,
    },
    {
      source: "/wp-admin",
      destination: "/dashboard/users",
      permanent: true,
    },
  ],

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {},
};

export default nextConfig;
