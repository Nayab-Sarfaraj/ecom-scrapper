const puppeteer = require("puppeteer");

const fetchAmazonProducts = async (searchQuery, currentPage) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    const AllProducts = [];

    // for (let i = 1; i <= page; i++) {
    const url = `https://www.amazon.in/s?k=${searchQuery}&page=${currentPage}`;
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    console.log("here");
    const products = await page.evaluate(() => {
      const data = document.querySelectorAll(
        `div[class="a-section"]>div[class="puisg-row"]`
      );

      return Array.from(data).map((prd) => {
        const title =
          prd.querySelector('[data-cy="title-recipe"] > a> h2 > span') ||
          "No title";

        const price =
          prd.querySelector(
            `span[class="a-price"]>span>span[class="a-price-whole"]`
          ) || "No price";
        const url =
          prd.querySelector(
            `
          [data-cy="title-recipe"]>a
          `
          ) || "No url";
        const image =
          prd.querySelector(
            `
            div>img[class="s-image"]
            `
          ) || "No images";

        // const originalPrice =
        //   prd.querySelector(
        //     `div[class="a-section"]>span[class="a-price"]>span[class="a-offscreen"]`
        //   ) || "No original price";
        const rating = prd.querySelector(
          `i[data-cy="reviews-ratings-slot"]>span`
        );
        // return title.innerHTML;
        return {
          title: title.innerHTML,
          rating: rating ? rating.innerHTML.split(" ")[0] : "No Rating",
          price: price.innerHTML,
          //   originalPrice: originalPrice.innerHTML,
          image: image.getAttribute("src"),
          url:
            url !== "No url"
              ? "https://www.amazon.in" + url.getAttribute("href")
              : url,
        };
      });
    });
    AllProducts.push(...products);
    // }
    console.log(AllProducts);
    // fs.writeFileSync("amazon.json", JSON.stringify(AllProducts, null, 2));
    return AllProducts;
    await browser.close();
  } catch (error) {
    console.log(error);
    // console.log(error.message);
    console.log("GOT AN ERROR........................");
    // await browser.close();
  }
};

module.exports = fetchAmazonProducts;
