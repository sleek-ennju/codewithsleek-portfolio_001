module.exports = {
  ci: {
    collect: {
      url: [
        "https://codewithsleek-portfolio.vercel.app/",
        "https://codewithsleek-portfolio.vercel.app/projects",
        "https://codewithsleek-portfolio.vercel.app/projects/ukraft-african-crafts-ecommerce-platform",
      ],
      numberOfRuns: 2,
      settings: {
        formFactor: "mobile",
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 },
        throttlingMethod: "simulate",
        chromeFlags: "--headless --no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
};
