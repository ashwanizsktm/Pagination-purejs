// Returns an array of maxLength (or less) page numbers
// where a 0 in the returned array denotes a gap in the series.
// Parameters:
//   totalPages:     total number of pages
//   page:           current page
//   maxLength:      maximum size of returned array
function getPageList(totalPages, page, maxLength) {

  if (maxLength < 5) throw "maxLength must be at least 5";

  function range(start, end) {
    return Array.from(Array(end - start + 1), (_, i) => i + start);
  }

  var sideWidth = maxLength < 9 ? 1 : 2;
  var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
  var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
  if (totalPages <= maxLength) {
    // no breaks in list
    return range(1, totalPages);
  }

  if (page <= maxLength - sideWidth - 1 - rightWidth) {
    // no break on left of page
    return range(1, maxLength - sideWidth - 1)
      .concat(0, range(totalPages - sideWidth + 1, totalPages));
  }

  if (page >= totalPages - sideWidth - 1 - rightWidth) {
    // no break on right of page
    return range(1, sideWidth)
      .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
  }

  // Breaks on both sides
  return range(1, sideWidth)
    .concat(0, range(page - leftWidth, page + rightWidth),
      0, range(totalPages - sideWidth + 1, totalPages));
}

// //// use of above function...

(function () {
  // Number of items and limits the number of items per page..
  let jar = document.getElementById("jar")
  let contents = document.querySelectorAll(".content");
  var numberOfItems = contents.length;
  var limitPerPage = 4;
  // Total pages rounded upwards
  var totalPages = Math.ceil(numberOfItems / limitPerPage);
  // Number of buttons at the top, not counting prev/next,
  // but including the dotted buttons.
  // Must be at least 5:
  var paginationSize = 5;
  var currentPage;

  function showPage(whichPage) {
    if (whichPage < 1 || whichPage > totalPages) return false;
    currentPage = whichPage;
    // $(".content").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

    let contentHide = Array.from(document.querySelectorAll(".content"));


    contentHide.forEach(ele => {
      ele.style.display = "none";
    });

    let contentShow = contentHide.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage);
    contentShow.forEach(ele => {
      ele.style.display = "block";
    })

    let paginationList = Array.from(document.querySelectorAll(".pagination li"));
    paginationList.slice(1, -1).forEach(ele => {
      ele.remove();
    });

    getPageList(totalPages, currentPage, paginationSize).forEach(item => {
      let nextPage = document.querySelector("#next-page");
      let theList = document.createElement('li');
      theList.classList.add("page-item", (item ? "current-page" : "disabled"));
      theList.classList.toggle("active", item === currentPage)
      let aEle = document.createElement('a');
      aEle.setAttribute("class", "page-link");
      aEle.setAttribute("href", "javascript:void(0)");
      aEle.textContent = (item || "...");
      theList.appendChild(aEle);
      pagination.insertBefore(theList, nextPage);
    });

    // Disable prev/next when at first/last page:
    let previousPage = document.querySelector("#previous-page");
    let nextPage = document.querySelector("#next-page");

    previousPage.classList.toggle("disabled", currentPage === 1);
    nextPage.classList.toggle("disabled", currentPage === totalPages);
    return true;
  }

  //     // Include the prev/next buttons:
  //     // create list and a elememt
  //     // li prev

  let pagination = document.querySelector(".pagination");
  let aPrev = document.createElement("a");
  aPrev.setAttribute("class", "page-link");
  aPrev.setAttribute("href", "javascript:void(0)");
  aPrev.textContent = "prev";

  let liPrev = document.createElement("li");
  liPrev.setAttribute("class", "page-item");
  liPrev.setAttribute("id", "previous-page");
  liPrev.appendChild(aPrev);
  //  a next..

  let aNext = document.createElement("a");
  aNext.setAttribute("class", "page-link");
  aNext.setAttribute("href", "javascript:void(0)");
  aNext.textContent = "next";
  // li next
  let liNext = document.createElement("li");
  liNext.setAttribute("class", "page-item");
  liNext.setAttribute("id", "next-page");
  liNext.appendChild(aNext)
  pagination.append(liPrev, liNext);
  // Show the page links

  jar.style.display = "block";
  showPage(1);

document.onclick = function() {
   let notActiveItem = document.querySelectorAll(".pagination li.current-page:not(.active)");
   notActiveItem.forEach( ele => {
     ele.addEventListener('click', () => {
       showPage(+ (ele.textContent))
     })
   })
}
  
  let previousPage = document.querySelector("#previous-page");
  let nextPage = document.querySelector("#next-page");

  nextPage.addEventListener("click", () => {
    return showPage(currentPage + 1);
  });

  previousPage.addEventListener("click", () => {
    return showPage(currentPage - 1);
  });
})();

