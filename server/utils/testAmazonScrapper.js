const puppeteer = require("puppeteer");

const testfetchAmazonProducts = async (
  searchQuery,
  currentPage,
  minPrice,
  maxPrice
) => {
  console.log(minPrice);
  try {
    const searchArr = searchQuery.trim().split(" ");
    if (searchArr.length === 1) {
      searchQuery = searchQuery;
    } else {
      let str = "";
      searchArr.forEach((ele, i) => {
        if (i !== searchArr.length - 1) str += ele + "+";
        else str += ele;
      });
      searchQuery = str;
    }
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
    // console.log(searchQuery);
    const url = `https://www.amazon.in/s?k=${searchQuery}&page=${currentPage}&low-price=${minPrice}&high-price=${maxPrice}&s=price-asc-rank`;
    console.log(`Navigating to ${url}`);

    const selectorOne = `div[data-index]`;
    const selectorTwo = `div[class="a-section"]>div[class="puisg-row"]`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const isSelectorOnePresent = (await page.$(selectorOne)) !== null;
    const isSelectorTwoPresent = (await page.$(selectorTwo)) !== null;
    console.log(isSelectorOnePresent);
    console.log(isSelectorTwoPresent);
    if (isSelectorTwoPresent) {
      const products = await page.evaluate(() => {
        const data = document.querySelectorAll(
          `div[class="a-section"]>div[class="puisg-row"]`
        );

        return Array.from(data).map((prd) => {
          const title = prd.querySelector(
            '[data-cy="title-recipe"] > a> h2 > span'
          );

          const price = prd.querySelector(
            `span[class="a-price"]>span>span[class="a-price-whole"]`
          );
          const url = prd.querySelector(
            `
          [data-cy="title-recipe"]>a
          `
          );
          const image = prd.querySelector(
            `
            div>img[class="s-image"]
            `
          );

          // const originalPrice =
          //   prd.querySelector(
          //     `div[class="a-section"]>span[class="a-price"]>span[class="a-offscreen"]`
          //   ) || "No original price";
          const rating = prd.querySelector(
            `i[data-cy="reviews-ratings-slot"]>span`
          );
          // return title.innerHTML;
          return {
            title: title ? title.innerHTML : "No titlw",
            rating: rating ? rating.innerHTML.split(" ")[0] : "No Rating",
            price: price ? price.innerHTML : "Price",
            //   originalPrice: originalPrice.innerHTML,
            image: image ? image.getAttribute("src") : "No Image",
            url: url
              ? "https://www.amazon.in" + url.getAttribute("href")
              : "No url",
          };
        });
      });
      AllProducts.push(...products);
      // }
      //   console.log(AllProducts);
      // fs.writeFileSync("amazon.json", JSON.stringify(AllProducts, null, 2));
      return AllProducts;
    } else {
      console.log("heres");
      const products = await page.evaluate(() => {
        const data = document.querySelectorAll(`div[data-index]`);
        // return Array.from(data);
        return Array.from(data).map((prd) => {
          const title =
            prd.querySelector(
              '[data-cy="title-recipe"] > a> h2 > span' || ""
            ) || "No title";

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
          // const image =
          //   prd.querySelector(`img[class="s-image"]`) || "No images";
          const image = prd.querySelector(
            `div[class="s-image-padding"]>span>a>div>img`
          );
          //   return image ? image.getAttribute("src") : "No Image";

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
            image: image !== null ? image.getAttribute("src") : "No image",
            url:
              url !== "No url"
                ? "https://www.amazon.in" + url.getAttribute("href")
                : url,
          };
        });
      });
      AllProducts.push(...products);
      return AllProducts;
    }

    await browser.close();
  } catch (error) {
    console.log(error);
    // console.log(error.message);
    console.log("GOT AN ERROR........................");
    // await browser.close();
  }
};

module.exports = testfetchAmazonProducts;
