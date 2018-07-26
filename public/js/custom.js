(function() {

  // VARIABLES
  const timeline = document.querySelector(".timeline ol"),
    elH = document.querySelectorAll(".timeline li > div"),
    arrows = document.querySelectorAll(".timeline .arrows .arrow"),
    arrowPrev = document.querySelector(".timeline .arrows .arrow__prev"),
    arrowNext = document.querySelector(".timeline .arrows .arrow__next"),
    firstItem = document.querySelector(".timeline li:first-child"),
    lastItem = document.querySelector(".timeline li:last-child"),
    timeline_box = document.querySelector(".timeline")
    xScrolling = 280,
    disabledClass = "disabled";

  // START
  window.addEventListener("load", init);

  function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

  function init() {
    setEqualHeights(elH);
    animateTl(xScrolling, arrows, timeline);
    setSwipeFn(timeline, arrowPrev, arrowNext);
    setKeyboardFn(arrowPrev, arrowNext);
    timeline_offset = offset(timeline_box);
    isElementInViewport(firstItem, timeline_offset.top, timeline_offset.left) ? setBtnState(arrowPrev) : setBtnState(arrowPrev, false);
    isElementInViewport(lastItem, timeline_offset.top, timeline_offset.left) ? setBtnState(arrowNext) : setBtnState(arrowNext, false);
  }

  // SET EQUAL HEIGHTS
  function setEqualHeights(el) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      const singleHeight = el[i].offsetHeight;

      if (counter < singleHeight) {
        counter = singleHeight;
      }
    }

    for (let i = 0; i < el.length; i++) {
      el[i].style.height = `${counter}px`;
    }
  }

  // CHECK IF AN ELEMENT IS IN VIEWPORT
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el, starting_top, starting_left) {
    const rect = el.getBoundingClientRect();
    console.log(rect, starting_top, starting_left, window.innerHeight, window.innerWidth, document.documentElement.clientHeight, 
      document.documentElement.clientWidth);
    return (
      rect.top >= starting_top &&
      rect.left >= starting_left &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // SET STATE OF PREV/NEXT ARROWS
  function setBtnState(el, flag = true) {
    console.log(el, flag);
    if (flag) {
      el.classList.add(disabledClass);
    } else {
      if (el.classList.contains(disabledClass)) {
        el.classList.remove(disabledClass);
      }
      el.disabled = false;
    }
  }

  // ANIMATE TIMELINE
  function animateTl(scrolling, el, tl) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      el[i].addEventListener("click", function() {
        if (!arrowPrev.disabled) {
          arrowPrev.disabled = true;
        }
        if (!arrowNext.disabled) {
          arrowNext.disabled = true;
        }
        const sign = (this.classList.contains("arrow__prev")) ? "" : "-";
        if (counter === 0) {
          tl.style.transform = `translateX(-${scrolling}px)`;
        } else {
          const tlStyle = getComputedStyle(tl);
          // add more browser prefixes if needed here
          const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
          const values = parseInt(tlTransform.split(",")[4]) + parseInt(`${sign}${scrolling}`);
          tl.style.transform = `translateX(${values}px)`;
        }

        timeline_offset = offset(timeline_box);
        setTimeout(() => {
          isElementInViewport(firstItem, timeline_offset.top, timeline_offset.left) ? setBtnState(arrowPrev) : setBtnState(arrowPrev, false);
          isElementInViewport(lastItem, timeline_offset.top, timeline_offset.left) ? setBtnState(arrowNext) : setBtnState(arrowNext, false);
        }, 1100);

        counter++;
      });
    }
  }

  // ADD SWIPE SUPPORT FOR TOUCH DEVICES
  function setSwipeFn(tl, prev, next) {
    const hammer = new Hammer(tl);
    hammer.on("swipeleft", () => next.click());
    hammer.on("swiperight", () => prev.click());
  }

  // ADD BASIC KEYBOARD FUNCTIONALITY
  function setKeyboardFn(prev, next) {
    document.addEventListener("keydown", (e) => {
      if ((e.which === 37) || (e.which === 39)) {
        const timelineOfTop = timeline.offsetTop;
        const y = window.pageYOffset;
        if (timelineOfTop !== y) {
          window.scrollTo(0, timelineOfTop);
        }
        if (e.which === 37) {
          prev.click();
        } else if (e.which === 39) {
          next.click();
        }
      }
    });
  }

})();