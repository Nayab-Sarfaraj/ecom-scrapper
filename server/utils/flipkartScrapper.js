const { default: puppeteer } = require("puppeteer");

const fetchFlipkartProduct = async (
  searchQuery,
  currentPage,
  minPrice,
  maxPrice
) => {
  try {
    // Prepare the search query
    searchQuery = searchQuery.trim().split(" ").join("+");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );

    const url = `https://www.flipkart.com/search?q=${searchQuery}&page=${currentPage}&p%5B%5D=facets.price_range.from%3D${minPrice}&p%5B%5D=facets.price_range.to%3DMax`;
    // `p%5B%5D=facets.price_range.from%3D60000&p%5B%5D=facets.price_range.to%3DMax`;
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const products = await page.evaluate(() => {
      // Helper function to safely extract data
      const getData = (element, selector, attr = "textContent") => {
        const foundElement = element.querySelector(selector);
        if (!foundElement) return null;
        return attr === "textContent"
          ? foundElement.textContent.trim()
          : foundElement.getAttribute(attr);
      };

      const elements = document.querySelectorAll("div[data-id]");
      return Array.from(elements).map((item) => {
        const id = item.getAttribute("data-id");
        return {
          id,
          image:
            getData(item, ".DByuf4", "src") ||
            getData(item, "._53J4C-", "src") ||
            "No Image",
          title:
            getData(item, ".DByuf4", "alt") ||
            getData(item, ".WKTcLC", "title") ||
            "No Title",
          price:
            getData(item, ".Nx9bqj") || getData(item, ".price") || "No Price",
          rating:
            getData(item, ".XQDdHH") || getData(item, ".rating") || "No Rating",
          originalPrice:
            getData(item, ".yRaY8j") ||
            getData(item, ".original-price") ||
            "No Original Price",
          url: getData(item, ".VJA3rP", "href") || "No URL",
          noOfReviews:
            getData(item, ".Wphh3N") ||
            getData(item, ".review-count") ||
            "No Reviews",
        };
      });
    });

    await browser.close();
    return products;
  } catch (error) {
    console.error("Error occurred:", error.message);
    return [];
  }
};

module.exports = fetchFlipkartProduct;
