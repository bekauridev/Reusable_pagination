/**
 * @file pagination.js
 * @description This file provides reusable pagination functionality for rendering paginated data in web applications.
 */

// ~~~~~~~~~~~~
// -- Helplers

/**
 * document.querySelector
 * @param {string} selector - The CSS selector to search for an element.
 * @returns {HTMLElement | HTMLInputElement | null} - The first DOM element that matches the selector, or null if none is found.
 */
function qs(selector) {
  return document.querySelector(selector);
}

/**
 * innerText() |
 * Sets the text content of a DOM element.
 * @param {HTMLElement | null} element - The DOM element whose text content will be set.
 * @param {string} text - The text content to set on the element.
 */
function setText(element, text) {
  if (element) {
    element.innerText = String(text);
  }
}
/** innerHTML |
 * Replaces the inner HTML of a DOM element with the specified content.
 * @param {HTMLElement | null} element - The DOM element whose inner HTML will be replaced.
 * @param {string} content - The HTML content to set as the inner HTML of the element.
 */
function render(element, content) {
  if (element) {
    element.innerHTML = content;
  }
}
/**
 * insertAdjacentHTML() |
 * Inserts HTML content into a DOM element at the specified location.
 * @param {HTMLElement | null} element - The DOM element to insert content into.
 * @param {InsertPosition} location -The position relative to the element's current content where the new HTML should be inserted.
 * Recommended values: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'.
 * @param {string} content - The HTML content to be inserted.
 */
function insertHtml(element, location, content) {
  element?.insertAdjacentHTML(location, content);
}

// ~~~~~~~~~~~~~~~
// -- Components
/**
 * @param {Object} props
 * @property {String} content - Content displayed in the button.
 * @property {String[]} classes - Array of classes
 * @return {HTMLElement} - DOM element representing a button component.
 */
function Button(props) {
  const { content, classes } = props;
  const button = document.createElement("button");
  button.className = classes.join(" ");
  button.setAttribute("aria-label", "button");
  button.textContent = content;
  return button;
}
const data = [
  {
    category: "Food",
  },
  {
    category: "Workout",
  },
  {
    category: "Sport",
  },
  {
    category: "Food",
  },
  {
    category: "Workout",
  },
  {
    category: "Sport",
  },
  {
    category: "Travel",
  },
];

function cardComponent(props) {
  const { category, title, content } = props;
  return `<div class="card w-50">
      <h5 class="card-header">${category}</h5>
      <div class="card-body">
          <a href="#" class="btn btn-secondary">Go somewhere</a>
      </div>
  </div>`;
}

// ~~~~~~~~~~~
// -- Config
const itemsPerPage = 1;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Pagination functionality
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let currentPage = 1;

/**
 * Renders a component based on the current page and data.
 * @param {HTMLElement} container - The container element where the component will be rendered.
 * @param {Array} data - The data to be displayed.
 * @param {Function} component - The function that generates the HTML for each data item.
 */
function renderComponent(container, data, component) {
  if (itemsPerPage <= 0)
    throw new Error(`itemsPerPage = ${itemsPerPage} | It should be more than 0`);

  // Clear existing items
  render(container, "");

  const totalItems = data.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Insert items for the current page
  for (let i = startIndex; i < endIndex; i++) {
    insertHtml(container, "beforeend", component(data[i]));
  }
}

/**
 * Creates a pagination button.
 * @param {string} text - The text to be displayed on the button.
 * @param {boolean} isActive - Indicates if the button is active.
 * @param {Function} onClick - The click event handler for the button.
 * @returns {HTMLElement} The created button element.
 */
function createButton(text, isActive, onClick) {
  const buttonEl = Button({
    content: text,
    classes: ["btn", `btn--pagination${isActive ? " active" : ""}`],
  });
  buttonEl.addEventListener("click", onClick);
  return buttonEl;
}

/**
 * Adds an ellipsis element to the pagination container.
 * @param {HTMLElement} paginationContainer - The container element for pagination buttons.
 */
function addEllipsis(paginationContainer) {
  const ellipsis = document.createElement("span");
  setText(ellipsis, "...");
  ellipsis.classList.add("ellipsis", "disabled");
  paginationContainer.appendChild(ellipsis);
}

/**
 * Creates pagination buttons.
 * @param {HTMLElement} paginationContainer - The container element for pagination buttons.
 * @param {Array} data - The data to be paginated.
 * @param {HTMLElement} componentContainer - The container element for the component.
 * @param {Function} component - The function that generates the HTML for each data item.
 */
function createPaginationButtons(
  paginationContainer,
  data,
  componentContainer,
  component
) {
  if (itemsPerPage <= 0)
    throw new Error(`itemsPerPage = ${itemsPerPage} | It should be more than 0`);
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Clear existing buttons
  render(paginationContainer, "");

  let startPage, endPage;

  if (totalPages <= 5) {
    // Less than or equal to 6 total pages, show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than 6 total pages, handle ellipsis logic
    if (currentPage <= 3) {
      startPage = 1;
      // before Ellipsis [][][][]...[]
      endPage = 4;
    } else if (currentPage + 2 >= totalPages) {
      // []...[][][][]
      startPage = totalPages - 3;
      endPage = totalPages;
    } else {
      // Current Page is in middle in this case [][o][]
      startPage = currentPage - 1;
      endPage = currentPage + 1;

      // Current Page is in middle in this case [][][o][][]
      // startPage = currentPage - 2;
      // endPage = currentPage + 2;
    }
  }

  // Create button for the first page
  if (endPage !== 1) {
    paginationContainer.appendChild(
      createButton(1, currentPage === 1, () => {
        currentPage = 1;
        paginateComponent(componentContainer, paginationContainer, data, component);
      })
    );
  }

  // Add ellipsis if needed
  if (startPage > 2) {
    addEllipsis(paginationContainer);
  }

  // Create buttons for the range of pages
  for (let i = startPage; i <= endPage; i++) {
    if (i !== 1 && i !== totalPages) {
      paginationContainer.appendChild(
        createButton(i, currentPage === i, () => {
          currentPage = i;
          paginateComponent(componentContainer, paginationContainer, data, component);
        })
      );
    }
  }

  // Add ellipsis if needed
  if (endPage < totalPages - 1) {
    addEllipsis(paginationContainer);
  }

  // Create button for the last page
  if (endPage !== 1) {
    paginationContainer.appendChild(
      createButton(totalPages, currentPage === totalPages, () => {
        currentPage = totalPages;
        paginateComponent(componentContainer, paginationContainer, data, component);
      })
    );
  }
}
/**
 * Paginates and renders a component with pagination buttons.
 * @param {HTMLElement} componentContainer - The container element for the component.
 * @param {HTMLElement} paginationContainer - The container element for pagination buttons.
 * @param {Array} data - The data to be paginated.
 * @param {Function} component - The function that generates the HTML for each data item.
 */
function paginateComponent(componentContainer, paginationContainer, data, component) {
  renderComponent(componentContainer, data, component);
  createPaginationButtons(paginationContainer, data, componentContainer, component);
}

// ~~~~~~~~~~~~~~~~~
// ~~~~~ USAGE ~~~~

const wrapper = qs(".paginated-wrapper");
const pagination = qs(".pagination");
console.log(pagination);
paginateComponent(wrapper, pagination, data, cardComponent);
