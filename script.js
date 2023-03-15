const mobileNav = document.querySelector('.mobile-nav-link');
const formPlan = document.querySelector('.form_plan');
const acc = document.querySelectorAll('.accordion');
const sideNavLinks = document.querySelectorAll('.nav-step');
const radioInputs = document.querySelectorAll('.panel input[type="radio"]');

const blanks = {
  preference: '',
  type: '',
  weight: '',
  ground: '',
  delivery: '',
};

mobileNav.addEventListener('click', () => {
  const menu = document.getElementById('nav-links');
  const navIcon = document.getElementById('mobile-nav-icon');
  menu.classList.toggle('open');
  if (menu.classList.contains('open')) {
    navIcon.src = './assets/shared/mobile/icon-close.svg';
  } else {
    navIcon.src = './assets/shared/mobile/icon-hamburger.svg';
  }
});

if (acc.length) {
  const summaryParagraph = document.createElement('p');
  const summaryContainer = document.querySelector('.summary-container');
  summaryContainer.appendChild(summaryParagraph);
  summaryParagraph.innerHTML =
    "❝I drink my coffee using <span class='blank underline'></span>, with a <span class='blank underline'></span> type of bean. <span class='blank underline'></span>, sent to me <span class='blank underline'></span>.❞";

  acc.forEach(el =>
    el.addEventListener('click', function () {
      // Select matching side navigation link
      sideNavLinks.forEach(function (link) {
        const selectedAcc = link.getAttribute('href').slice(1);
        const id = el.getAttribute('id');
        if (id === selectedAcc) {
          document.querySelector('.selected').classList.remove('selected');
          link.classList.add('selected');
        }
      });
      // Open accordion panel
      this.classList.toggle('active');
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.style.marginBottom = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.style.marginBottom = '96px';
      }
    })
  );

  // Open matching accordion panel when clicked on side navigation link
  sideNavLinks.forEach(link =>
    link.addEventListener('click', function () {
      document.querySelector('.selected').classList.remove('selected');
      this.classList.add('selected');
      const selectedAcc = this.getAttribute('href').slice(1);
      acc.forEach(function (el) {
        const id = el.getAttribute('id');
        if (id === selectedAcc) {
          el.classList.add('active');
          const panel = el.nextElementSibling;
          panel.style.maxHeight = panel.scrollHeight + 'px';
          panel.style.marginBottom = '96px';
        }
      });
    })
  );

  radioInputs.forEach(input =>
    input.addEventListener('change', function () {
      const label = input.nextElementSibling;
      const labelHeading = label.querySelector('.label-heading').textContent;
      const priceSpans = document.querySelectorAll('.price');

      Object.keys(blanks).forEach(function (key) {
        if (key === input.name) {
          blanks[key] = labelHeading;
        }
      });

      // If "Capsule" is selected for the first option, the "Want us to grind them?" section should be disabled and not able to be opened
      // Fill in summary text with the selected inputs
      if (blanks.preference === 'Capsule') {
        summaryParagraph.innerHTML = `❝I drink my coffee using <span class="blank underline">Capsules,</span> with a <span class="blank underline">${blanks.type}</span> type of bean. <span class="blank underline">${blanks.weight},</span> sent to me <span class="blank underline">${blanks.delivery}</span>.❞`;

        sideNavLinks[3].classList.add('disabled');
        acc[3].disabled = true;
        const panel = acc[3].nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
          panel.style.marginBottom = null;
        }
      } else {
        summaryParagraph.innerHTML = `❝I drink my coffee as <span class="blank underline">${blanks.preference},</span> with a <span class="blank underline">${blanks.type}</span> type of bean. <span class="blank underline">${blanks.weight}</span> ground ala <span class="blank underline">${blanks.ground},</span> sent to me <span class="blank underline">${blanks.delivery}</span>.❞`;

        sideNavLinks[3].classList.remove('disabled');
        acc[3].disabled = false;
      }

      // Remove underline if an input is selected, disable/enable submit button
      const underlines = document.querySelectorAll('span.blank');
      underlines.forEach(function (element) {
        if (element.textContent.length > 0) {
          document.querySelector('form.form_plan button.cta').disabled = false;
          element.classList.remove('underline');
        } else {
          document.querySelector('form.form_plan button.cta').disabled = true;
        }
      });

      // Shipment price
      const prices = [
        {
          weight: '250g',
          weekly: '7.20',
          twice: '9.60',
          monthly: '12.00',
        },
        {
          weight: '500g',
          weekly: '13.00',
          twice: '17.50',
          monthly: '22.00',
        },
        {
          weight: '1000g',
          weekly: '22.00',
          twice: '32.00',
          monthly: '42.00',
        },
      ];
      // Update per shipment price based on weight selected
      if (input.name === 'weight') {
        const price = prices.find(item => item.weight === labelHeading);
        priceSpans[0].textContent = price.weekly;
        priceSpans[1].textContent = price.twice;
        priceSpans[2].textContent = price.monthly;
      }
    })
  );
}

function calcTotal() {
  const checkedInput = Array.from(radioInputs).find(
    input => input.name === 'delivery' && input.checked === true
  );
  const priceString = checkedInput.nextElementSibling.querySelector('.price').textContent;
  const price = Number(priceString);
  const inputId = checkedInput.getAttribute('id');
  if (inputId === 'weekly') {
    return price * 4;
  } else if (inputId === 'twice') {
    return price * 2;
  } else {
    return price;
  }
}

if (formPlan) {
  formPlan.addEventListener('submit', e => {
    e.preventDefault();
    const summaryText = document.querySelector('.summary-container p').innerHTML;
    const body = document.querySelector('.body_plan');
    const overlay = document.querySelector('.overlay');
    const summaryElement = document.querySelector('.modal--summary');
    const modalBody = document.querySelector('.modal--body');
    body.classList.add('overlay-visible');
    overlay.classList.remove('hidden');
    summaryElement.innerHTML = summaryText;

    const prevBtn = document.querySelector('.modal-btn');
    if (prevBtn) {
      prevBtn.remove();
    }
    const modalBtn = document.createElement('button');
    modalBtn.className = 'modal-btn';

    const total = calcTotal();

    if (window.innerWidth < 700) {
      // append button with total price per month
      modalBtn.textContent = `Checkout - $${total.toFixed(2)} / mo`;
      modalBody.appendChild(modalBtn);
    } else {
      // remove totalContainer if there is one
      const prevContainer = document.querySelector('.price-container');
      if (prevContainer) {
        prevContainer.remove();
      }
      // append total span and button
      const totalContainer = document.createElement('div');
      totalContainer.className = 'price-container';
      const totalText = document.createElement('span');
      totalText.textContent = `$${total.toFixed(2)} / mo`;
      modalBtn.textContent = 'Checkout';
      totalContainer.append(totalText, modalBtn);
      modalBody.appendChild(totalContainer);
    }
  });
}

window.addEventListener('click', e => {
  const body = document.querySelector('.body_plan');
  const overlay = document.querySelector('.overlay');
  if (e.target === overlay) {
    overlay.classList.add('hidden');
    body.classList.remove('overlay-visible');
  }
});
