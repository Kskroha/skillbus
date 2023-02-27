const $table = document.querySelector('.table');
const $tableBody = document.getElementById('table-body');
const $tableLoad = document.querySelector('.table-load');

const $filterBtnID = document.querySelector('.table__filter-btn--id');
const $filterBtnNames = document.querySelector('.table__filter-btn--names');
const $filterBtnCreated = document.querySelector('.table__filter-btn--created');
const $filterBtnChanged = document.querySelector('.table__filter-btn--changed');

const $newClientModal = document.querySelector('.new-client');
const $newClientForm = document.getElementById('new-client__form');
const $newClientSurnameInp = document.getElementById('new-client__surname');
const $newClientNameInp = document.getElementById('new-client__name');
const $newClientLastnameInp = document.getElementById('new-client__lastname');
const $newClientSurnameLabel = document.getElementById('surname-label');
const $newClientNameLabel = document.getElementById('name-label');
const $newClientLastnameLabel = document.getElementById('lastname-label');
const $overlay = document.querySelector('.overlay');
const $newClientModalClose = document.querySelector('.close-modal-btn');
const $newClientCancel = document.querySelector('.create-cancel-btn');

const $newClientOpenBtn = document.querySelector('#add-client');
const contactsWrapper = document.querySelector('.new-client__contacts');
const $newContactButton = document.querySelector('.contact-btn');
const $newClientError = document.querySelector('.new-client__error');

const $confirmDialog = document.getElementById('confirm-dialog');
const $confirmBtn = document.querySelector('.confirm-btn');
const $confirmCancelBtn = document.querySelector('.confirm-cancel-btn');
const $confirmCloseBtn = document.querySelector('.confirm-close-btn');
const $confirmModalError = document.querySelector('.confirm-modal__error');
const $confirmCloseBtns = document.querySelectorAll('.dialog-close');

const $searchInput = document.querySelector('.page__search');
$filterBtnID.classList.add('sort-toMax');

let sortColumnFlag = 'id';
let sortDirFlag = true;
let timeout;

$newClientSurnameInp.addEventListener('click', () => {
  $newClientSurnameLabel.classList.remove('form-modal__label--surname');
});

$newClientNameInp.addEventListener('click', () => {
  $newClientNameLabel.classList.remove('form-modal__label--name');
});

$newClientLastnameInp.addEventListener('click', () => {
  $newClientLastnameLabel.classList.remove('form-modal__label--lastname');
});

// вспомогательные функции

function getDateString(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return `${day}.${month}.${year}`;
};

function getTimeString(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  return `${hours}:${minutes}`;
};

function getContactString(value) {
  switch (value) {
    case 'phone':
      return 'Телефон';
      break;
    case 'additional-phone':
      return 'Телефон';
      break;
    case 'fb':
      return 'Facebook';
      break;
    case 'vk':
      return 'Vkontakte';
      break;
    case 'email':
      return 'Email';
      break;
    default:
      return 'Другое';
  }
};

function getContactType(value) {
  switch (value) {
    case 'Телефон':
      return 'phone';
      break;
    case 'Доп.телефон':
      return 'additional-phone';
      break;
    case 'Facebook':
      return 'fb';
      break;
    case 'Vkontakte':
      return 'vk';
      break;
    case 'Email':
      return 'email';
      break;
    default:
      return 'other';
  }
};

// создание нового контакта

function createContactElement(contact) {
  const $contactDiv = document.createElement('div');
  const $contactSelect = document.createElement('select');
  const $selectOptionPhone = document.createElement('option');
  const $selectOptionAddPhone = document.createElement('option');
  const $selectOptionEmail = document.createElement('option');
  const $selectOptionVk = document.createElement('option');
  const $selectOptionFb = document.createElement('option');
  const $selectOptionOther = document.createElement('option');

  const $inputWrapper = document.createElement('div');
  const $contactInput = document.createElement('input');
  const $inputRemoveBtn = document.createElement('button');

  $contactDiv.classList.add('add-new-contact');
  $contactSelect.classList.add('js-choice');
  $inputWrapper.classList.add('input-wrapper');
  $contactInput.classList.add('contact-input');
  $inputRemoveBtn.classList.add('clear-btn', 'btn-reset', 'hidden');

  $selectOptionPhone.value = 'phone';
  $selectOptionAddPhone.value = 'additional-phone';
  $selectOptionEmail.value = 'email';
  $selectOptionVk.value = 'vk';
  $selectOptionFb.value = 'fb';
  $selectOptionOther.value = 'other';

  $selectOptionPhone.textContent = 'Телефон';
  $selectOptionAddPhone.textContent = 'Доп.телефон';
  $selectOptionEmail.textContent = 'Email';
  $selectOptionVk.textContent = 'Vk';
  $selectOptionFb.textContent = 'Facebook';
  $selectOptionOther.textContent = 'Другое';

  if (contact) {
    switch (contact.type) {
      case $selectOptionPhone.textContent:
        $selectOptionPhone.setAttribute('selected', 'selected');
        break;
      case $selectOptionAddPhone.textContent:
        $selectOptionAddPhone.setAttribute('selected', 'selected');
        break;
      case $selectOptionEmail.textContent:
        $selectOptionEmail.setAttribute('selected', 'selected');
        break;
      case $selectOptionVk.textContent:
        $selectOptionEmail.setAttribute('selected', 'selected');
        break;
      case $selectOptionFb.textContent:
        $selectOptionFb.setAttribute('selected', 'selected');
        break;
      default:
        $selectOptionOther.setAttribute('selected', 'selected');
    }

    $contactInput.value = contact.value;
  }

  $contactSelect.append($selectOptionPhone);
  $contactSelect.append($selectOptionAddPhone);
  $contactSelect.append($selectOptionEmail);
  $contactSelect.append($selectOptionVk);
  $contactSelect.append($selectOptionFb);
  $contactSelect.append($selectOptionOther);

  $inputWrapper.append($contactInput);
  $inputWrapper.append($inputRemoveBtn);

  $contactDiv.append($contactSelect);
  $contactDiv.append($inputWrapper);

  $inputRemoveBtn.classList.remove('hidden');

  $inputRemoveBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    $contactDiv.remove();

    const contactElements = document.querySelectorAll('.add-new-contact');
    const contactBtn = document.querySelector('.contact-btn.hidden');

    if (contactElements.length === 9) {
      contactBtn.classList.remove('hidden');
    }
  });

  const choices = new Choices($contactSelect, {
    allowHTML: true,
    searchEnabled: false,
    placeholder: true,
    itemSelectText: '',
    position: 'bottom'
  });

  return $contactDiv;
};

// создание элементов и отрисовка таблицы

function getClientItem(clientObj, onDelete) {
  const $clientTr = document.createElement('tr');
  const $clientTdID = document.createElement('td');
  const $clientTdName = document.createElement('td');
  const $clientTdCreated = document.createElement('td');
  const $clientTdChanged = document.createElement('td');
  const $clientTdContacts = document.createElement('td');
  const $clientTdActions = document.createElement('td');

  const $spanTimeCreated = document.createElement('span');
  const $spanTimeChanged = document.createElement('span');

  clientObj.contacts.forEach((contact) => {
    const $divTooltip = document.createElement('div');
    const $divMarker = document.createElement('div');
    const $divTooltipText = document.createElement('div');
    $divTooltip.classList.add('contacts__icon', 'tooltip');
    switch (contact.type) {
      case 'Телефон':
        $divMarker.classList.add('tooltip__marker', 'tooltip__marker--phone');
        break;
      case 'Email':
        $divMarker.classList.add('tooltip__marker', 'tooltip__marker--mail');
        break;
      case 'Facebook':
        $divMarker.classList.add('tooltip__marker', 'tooltip__marker--fb');
        break;
      case 'Vkontakte':
        $divMarker.classList.add('tooltip__marker', 'tooltip__marker--vk');
        break;
      default:
        $divMarker.classList.add('tooltip__marker', 'tooltip__marker--other');
    }
    $divTooltipText.classList.add('tooltip__text');
    $divTooltipText.textContent = contact.value;
    $divMarker.append($divTooltipText);
    $divTooltip.append($divMarker);
    $clientTdContacts.append($divTooltip);
    // $divTooltip.append($divTooltipText);
  });

  const $clientButtonsWrap = document.createElement('div');
  const $clientDeleteBtn = document.createElement('button');
  const $clientChangeBtn = document.createElement('button');

  //добавляем классы
  $clientTr.classList.add('table__row');
  $clientTdID.classList.add('table__data', 'id');
  $clientTdName.classList.add('table__data');
  $clientTdCreated.classList.add('table__data', 'dates');
  $clientTdChanged.classList.add('table__data', 'dates');
  $clientTdContacts.classList.add('table__data', 'contacts');
  $clientTdActions.classList.add('table__data');
  $clientButtonsWrap.classList.add('table__buttons');
  $spanTimeCreated.classList.add('time');
  $spanTimeChanged.classList.add('time');
  $clientChangeBtn.classList.add('table__btn', 'table__btn--change', 'btn-reset');
  $clientDeleteBtn.classList.add('table__btn', 'table__btn--delete', 'btn-reset');

  //добавляем содержимое
  $clientTdID.textContent = clientObj.id;
  $clientTdName.textContent = clientObj.fio;
  $clientTdCreated.textContent = clientObj.created;
  $clientTdChanged.textContent = clientObj.updated;
  $spanTimeCreated.textContent = clientObj.timeCreated;
  $spanTimeChanged.textContent = clientObj.timeupdated;
  $clientChangeBtn.textContent = 'Изменить';
  $clientDeleteBtn.textContent = 'Удалить';

  //добавляем на страницу
  $clientTr.append($clientTdID);
  $clientTr.append($clientTdName);
  $clientTr.append($clientTdCreated);
  $clientTr.append($clientTdChanged);
  $clientTr.append($clientTdContacts);
  $clientButtonsWrap.append($clientChangeBtn);
  $clientButtonsWrap.append($clientDeleteBtn);
  $clientTdActions.append($clientButtonsWrap);
  $clientTr.append($clientTdActions);
  $clientTdCreated.append($spanTimeCreated);
  $clientTdChanged.append($spanTimeChanged);

  //обработчики кнопок

  $clientDeleteBtn.addEventListener('click', (evt) => {
    // eslint-disable-next-line no-restricted-globals
    $confirmDialog.showModal();
    $confirmCancelBtn.addEventListener('click', () => {
      $confirmDialog.close();
    });
    $confirmCloseBtn.addEventListener('click', () => {
      $confirmDialog.close();
    });
    $confirmDialog.addEventListener('close', () => {
      if ($confirmDialog.returnValue === 'confirm') {
        $clientTr.remove();
        onDelete(clientObj.id);
      }
    });
  });

  $clientChangeBtn.addEventListener('click', () => {
    // eslint-disable-next-line no-restricted-globals
    const client = getClient(clientObj.id);
    renderUpdateModal(client, deleteClient);
  });

  return $clientTr;
};

async function renderClientsTable(clients) {
  const clientsList = await clients;
  $tableBody.innerHTML = '';

  if (clientsList !== null && clientsList !== '') {
    $tableLoad.classList.add('hidden');
    let copyClientsList = [...clientsList];
    const currentDate = new Date();

    copyClientsList.forEach((client) => {
      client.fio = `${client.surname} ${client.name} ${client.lastName}`;
      client.created = getDateString(new Date(client.createdAt));
      client.updated = getDateString(new Date(client.updatedAt));
      client.timeCreated = getTimeString(new Date(client.createdAt));
      client.timeupdated = getTimeString(new Date(client.updatedAt));
      client.madeDateTime = new Date(client.createdAt);
      client.changedDateTime = new Date(client.updatedAt);
    });

    // сортировка
    copyClientsList = copyClientsList.sort((a, b) => {
      let sort = a[sortColumnFlag] > b[sortColumnFlag];
      if (sortDirFlag === false) {
        sort = a[sortColumnFlag] < b[sortColumnFlag];
      }
      if (sort) {
        return -1;
      }
      return sort;
    });

    copyClientsList.forEach((client) => {
      const $newTr = getClientItem(client, deleteClient);
      $tableBody.append($newTr);
    });
  }
};

renderClientsTable(getClientsArray());

// работа с окном добавления нового клиента

$newClientOpenBtn.addEventListener('click', () => {
  $newClientModal.classList.remove('hidden');
  $overlay.classList.remove('hidden');
});

$newContactButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  const contactElements = document.querySelectorAll('.add-new-contact');
  if (contactElements.length === 10) {
    $newContactButton.classList.add('hidden');
    return;
  } else {
    $newContactButton.classList.remove('hidden');
    const newContact = createContactElement();
    contactsWrapper.append(newContact);
    contactsWrapper.classList.remove('hidden');
    const currentElements = document.querySelectorAll('.add-new-contact');
      if (currentElements.length === 10) {
        $newContactButton.classList.add('hidden');
        return;
      }
  }
});

$newClientForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  sendData(onNewClientFormSent, throwNewClientError);
});

function onNewClientModalClose() {
  $newClientModal.classList.add('hidden');
  $overlay.classList.add('hidden');
  const $newClientInputs = document.querySelectorAll('.new-client__input');
  $newClientInputs.forEach((input) => {
    input.value = '';
  });
  const contacts = $newClientModal.querySelectorAll('.add-new-contact');
  contacts.forEach((contact) => contact.remove());
  $newClientSurnameLabel.classList.add('form-modal__label--surname');
  $newClientNameLabel.classList.add('form-modal__label--name');
  $newClientLastnameLabel.classList.add('form-modal__label--lastname');
  $newContactButton.classList.remove('hidden');
  contactsWrapper.classList.add('hidden');
};

function onNewClientFormSent() {
  onNewClientModalClose();
  renderClientsTable(getClientsArray());
};

function throwNewClientError(errorText) {
  $newClientError.textContent = '';
  $newClientError.textContent = errorText;
}

$newClientModalClose.addEventListener('click', () => {
  onNewClientModalClose();
});

$newClientCancel.addEventListener('click', () => {
  onNewClientModalClose();
});

$newClientForm.addEventListener('click', (evt) => {
  evt._isClickWithinNewModal = true;
});

$newClientModal.addEventListener('click', (evt) => {
  if (evt._isClickWithinNewModal) {
    return;
  }
  onNewClientModalClose();
});

// работа с окном изменения данных

async function renderUpdateModal(client, onDelete) {
  const clientObj = await client;

  const $updateModal = document.createElement('div');
  const $updateModalWrap = document.createElement('div');
  const $updateForm = document.createElement('form');
  const $updateFormTopBlock = document.createElement('div');
  const $updateModalIdSpan = document.createElement('span');
  const $updateFormTitle = document.createElement('h2');
  const $updateFormFieldset = document.createElement('fieldset');
  const $updateFormFieldSurname = document.createElement('div');
  const $updateFormFieldName = document.createElement('div');
  const $updateFormLabelSpanSurname = document.createElement('span');
  const $updateFormLabelSpanName = document.createElement('span');
  const $updateFormFieldLastname = document.createElement('div');
  const $updateModalSurnameLabel = document.createElement('label');
  const $updateModalSurnameInp = document.createElement('input');
  const $updateModalNameLabel = document.createElement('label');
  const $updateModalNameInp = document.createElement('input');
  const $updateModalLastnameLabel = document.createElement('label');
  const $updateModalLastnameInp = document.createElement('input');
  const $updateFormButtons = document.createElement('div');
  const $updateFormContactsWrapper = document.createElement('div');

  const $updateAddContactBtn = document.createElement('button');
  const $updateAddContactBtnSpan = document.createElement('span');
  const $updateCancelBtn = document.createElement('button');
  const $updateFormDeleteBtn = document.createElement('button');
  const $updateFormSaveBtn = document.createElement('button');
  const $updateFormError = document.createElement('div');

  $updateModal.classList.add('form-modal', 'update-modal', 'hidden');
  $updateModalWrap.classList.add('form-modal__wrap');
  $updateForm.classList.add('form-modal__window');
  $updateFormTopBlock.classList.add('form-top-block');
  $updateModalIdSpan.classList.add('form-modal__id');
  $updateFormTitle.classList.add('form-modal__caption');

  $updateFormFieldset.classList.add('form-modal__fieldset');
  $updateFormFieldSurname.classList.add('form-field');
  $updateFormFieldName.classList.add('form-field');
  $updateFormFieldLastname.classList.add('form-field');
  $updateFormLabelSpanSurname.classList.add('required');
  $updateFormLabelSpanName.classList.add('required');
  $updateModalSurnameLabel.classList.add('form-modal__label');
  $updateModalSurnameInp.classList.add('form-modal__input');
  $updateModalNameLabel.classList.add('form-modal__label');
  $updateModalNameInp.classList.add('form-modal__input');
  $updateModalLastnameLabel.classList.add('form-modal__label');
  $updateModalLastnameInp.classList.add('form-modal__input');
  $updateFormButtons.classList.add('form-btns');
  $updateFormContactsWrapper.classList.add('client-info__contacts-wrapper', 'hidden');
  $updateAddContactBtn.classList.add('contact-btn', 'btn-reset');
  $updateCancelBtn.classList.add('client-info__cancel-btn', 'cancel-btn', 'btn-reset');
  $updateFormDeleteBtn.classList.add('delete-btn', 'btn-reset');
  $updateFormSaveBtn.classList.add('save-btn', 'btn-reset');
  $updateFormError.classList.add('client-info__error');

  $updateFormTitle.textContent = 'Изменить данные';
  $updateModalSurnameLabel.textContent = 'Фамилия';
  $updateModalNameLabel.textContent = 'Имя';
  $updateModalLastnameLabel.textContent = 'Отчество';
  $updateAddContactBtnSpan.textContent = 'Добавить контакт';
  $updateFormSaveBtn.textContent = 'Сохранить';
  $updateFormDeleteBtn.textContent = 'Удалить клиента';
  $updateFormLabelSpanSurname.textContent = '*';
  $updateFormLabelSpanName.textContent = '*';

  $updateModalWrap.append($updateForm);
  $updateForm.append($updateFormTopBlock);
  $updateFormTopBlock.append($updateFormTitle);
  $updateFormTopBlock.append($updateModalIdSpan);
  $updateForm.append($updateFormTopBlock);
  $updateForm.append($updateFormFieldset);
  $updateFormFieldset.append($updateFormFieldSurname);
  $updateFormFieldSurname.append($updateModalSurnameLabel);
  $updateModalSurnameLabel.append($updateFormLabelSpanSurname);
  $updateFormFieldSurname.append($updateModalSurnameInp);

  $updateFormFieldset.append($updateFormFieldName);
  $updateFormFieldName.append($updateModalNameLabel);
  $updateModalNameLabel.append($updateFormLabelSpanName);
  $updateFormFieldName.append($updateModalNameInp);

  $updateFormFieldset.append($updateFormFieldLastname);
  $updateFormFieldLastname.append($updateModalLastnameLabel);
  $updateFormFieldLastname.append($updateModalLastnameInp);

  $updateForm.append($updateCancelBtn);
  $updateAddContactBtn.append($updateAddContactBtnSpan);
  $updateFormButtons.append($updateFormContactsWrapper);
  $updateFormButtons.append($updateAddContactBtn);
  $updateFormButtons.append($updateFormSaveBtn);
  $updateFormButtons.append($updateFormDeleteBtn);
  $updateForm.append($updateFormButtons);

  $updateModal.append($updateModalWrap);

  $updateModalIdSpan.textContent = `ID: ${clientObj.id}`;
  $updateModalSurnameInp.value = clientObj.surname;
  $updateModalNameInp.value = clientObj.name;
  $updateModalLastnameInp.value = clientObj.lastName;

  if (clientObj.contacts.length > 0) {
    $updateFormContactsWrapper.classList.remove('hidden');
    clientObj.contacts.forEach((contact) => {
      const $newContact = createContactElement(contact);
      $updateFormContactsWrapper.append($newContact);
    });
  }

  $updateForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    sendChanges(onUpdateFormSent, throwUpdateError, clientObj, $updateModalSurnameInp.value, $updateModalNameInp.value, $updateModalLastnameInp.value);
  });

  $updateFormDeleteBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    $confirmDialog.showModal();
    $confirmCancelBtn.addEventListener('click', () => {
      $confirmDialog.close();
    });
    $confirmCloseBtn.addEventListener('click', () => {
      $confirmDialog.close();
    });
    $confirmDialog.addEventListener('close', () => {
      if ($confirmDialog.returnValue === 'confirm') {
        onDelete(clientObj.id);
      }
    });
  });

  $updateAddContactBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const contactElements = document.querySelectorAll('.add-new-contact');
    if (!contactElements) {
      const newContact = createContactElement();
      $updateFormContactsWrapper.append(newContact);
      $updateFormContactsWrapper.classList.remove('hidden');
      return;
    }
      const newContact = createContactElement();
      $updateFormContactsWrapper.append(newContact);
      $updateFormContactsWrapper.classList.remove('hidden');
      const allElements = document.querySelectorAll('.add-new-contact');
      if (allElements.length === 10) {
        $updateAddContactBtn.classList.add('hidden');
      }
  });

  $updateCancelBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    onCloseUpdateModal();
  });

  $updateForm.addEventListener('click', (evt) => {
    evt._isClickWithinUpdateModal = true;
  });

  $updateModal.addEventListener('click', (evt) => {
    if (evt._isClickWithinUpdateModal) {
      return;
    }
    onCloseUpdateModal();
  });

  $overlay.classList.remove('hidden');
  $updateModal.classList.remove('hidden');
  document.body.append($updateModal);
  const $contactElements = document.querySelectorAll('.add-new-contact');

  if ($contactElements.length === 10) {
    $updateAddContactBtn.classList.add('hidden');
  }
};

function onUpdateFormSent() {
  onCloseUpdateModal();
  renderClientsTable(getClientsArray());
};

function onCloseUpdateModal() {
  $overlay.classList.add('hidden');
  const $updateModal = document.querySelector('.update-modal');
  $updateModal.remove();
};

function throwUpdateError(errorText) {
  const $updateFormError = document.querySelector('.client-info__error');
  $updateFormError.textContent = '';
  $updateFormError.textContent = errorText;
};

function getContactsArray() {
  const $selects = document.querySelectorAll('select');
  const $contactInputs = document.querySelectorAll('.contact-input');
  const contacts = [];

  for (let i = 0; i < $selects.length; i++) {
    contacts.push({
      type: `${getContactString($selects[i].value)}`,
      value: `${$contactInputs[i].value}`,
    });
  }

  return contacts;
};

function getUpdatedContactsArray() {
  const contactElements = document.querySelectorAll('.add-new-contact');
  const updatedContacts = [];
  contactElements.forEach((element) => {
    updatedContacts.push({
      type: getContactString(element.querySelector('select').value),
      value: element.querySelector('input').value,
    });
  });
  return updatedContacts;
};

// обработчик поля поиска

$searchInput.addEventListener('input', () => {
  if ($searchInput.value === '') {
    renderClientsTable(getClientsArray());
    return;
  }
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    renderClientsTable(getRequestedClients($searchInput.value));
  }, 300);
});

// работа с сервером

async function getClientsArray() {
  const response = await fetch('http://localhost:3000/api/clients');
  const clientsList = await response.json();
  return clientsList;
}

async function getClient(clientID) {
  const response = await fetch(`http://localhost:3000/api/clients/${clientID}`);
  const client = await response.json();
  return client;
}

function deleteClient(clientID) {
  fetch(`http://localhost:3000/api/clients/${clientID}`, {
      method: 'DELETE',
  });
}

function sendChanges(onSuccess, onFail, client, surname, name, lastname) {
  fetch(`http://localhost:3000/api/clients/${client.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        surname: surname.trim(),
        name: name.trim(),
        lastName: lastname.trim(),
        contacts: getUpdatedContactsArray(),
      }),
  })
  .then((response) => {
    if (!response.ok) {
      if (response.status === 404) {
        onFail('Страница не найдена');
        return;
      }
      if (response.status === 422) {
        onFail('Не удалось обработать запрос');
        return;
      }
      if (response.status >= 500) {
        onFail('Технические неполадки на сервере');
        return;
      }
      onFail('Что-то пошло не так');
    }
    onSuccess();
  })
  .catch((error) => {
    if (!error.message || error.message === '') {
      onFail('Что-то пошло не так');
      return;
    }
    onFail(error.message);
  });
};

function sendData(onSuccess, onFail) {
  fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: $newClientNameInp.value.trim(),
        lastName: $newClientLastnameInp.value.trim(),
        surname: $newClientSurnameInp.value.trim(),
        contacts: getContactsArray(),
      }),
  })
  .then((response) => {
    if (!response.ok) {
      if (response.status === 404) {
        onFail('Страница не найдена');
        return;
      }
      if (response.status === 422) {
        onFail('Не удалось обработать запрос');
        return;
      }
      if (response.status >= 500) {
        onFail('Технические неполадки на сервере');
        return;
      }
      onFail('Что-то пошло не так');
    }
    onSuccess();
  })
  .catch((error) => {
    if (!error.message || error.message === '') {
      onFail('Что-то пошло не так');
      return;
    }
    onFail(error.message);
  });
};

async function getRequestedClients(searchString) {
  const response = await fetch(`http://localhost:3000/api/clients?search=${searchString}`);
  const clientsList = await response.json();
  return clientsList;
};

// фильтры

$filterBtnID.addEventListener('click', () => {
  $filterBtnID.classList.toggle('sort-toMax');

  sortColumnFlag = 'id';
  sortDirFlag = !sortDirFlag;
  renderClientsTable(getClientsArray());
});

$filterBtnNames.addEventListener('click', () => {
  $filterBtnNames.classList.toggle('sort-toMax');

  sortColumnFlag = 'surname';
  sortDirFlag = !sortDirFlag;
  renderClientsTable(getClientsArray());
});

$filterBtnCreated.addEventListener('click', () => {
  $filterBtnCreated.classList.toggle('sort-toMax');

  sortColumnFlag = 'madeDateTime';
  sortDirFlag = !sortDirFlag;
  renderClientsTable(getClientsArray());
});

$filterBtnChanged.addEventListener('click', () => {
  $filterBtnChanged.classList.toggle('sort-toMax');
  sortColumnFlag = 'changedDateTime';
  sortDirFlag = !sortDirFlag;
  renderClientsTable(getClientsArray());
});
