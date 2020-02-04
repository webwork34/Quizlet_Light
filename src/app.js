const addBtn = document.getElementById('add_new_set_btn'),
      mainPage = document.getElementById('main'),
      addPage = document.getElementById('add_new'),
      editPage = document.getElementById('edit'),
      addTerms = document.getElementById('add_terms'),
      saveTerms = document.getElementById('save_terms'),
      cancelBtn = document.getElementById('cancel'),
      inputName = document.getElementById('input_name'),
      openTermsBox = document.getElementById('open_terms'),
      studiedTermsBox = document.getElementById('studied_terms');

const zero = 0;
let count, setsArr, 
    studied = []; 


// відображення вивченних сетів
function renderStudied(){
  if(localStorage.getItem('studied')){
    studied = JSON.parse(localStorage.getItem('studied'));

    for (let i = 0; i < studied.length; i++) {
      const divSets = document.createElement('div');
      studiedTermsBox.appendChild(divSets).classList.add('studied_block');
      divSets.textContent = studied[i].name;

      const editBtn = document.createElement('button');
      const removeBtn = document.createElement('button');

      divSets.appendChild(editBtn).classList.add('edit_set_btn_studied');
      divSets.appendChild(removeBtn).classList.add('remove_set_btn_studied');

      editBtn.textContent = 'Edit';
      removeBtn.textContent = 'Remove';

      editBtn.disabled = true;
      const removeStudied = studiedTermsBox.querySelectorAll('.remove_set_btn_studied');
      const spanStudied = document.createElement('span');
      divSets.appendChild(spanStudied);

      let allSpanStudied = studiedTermsBox.querySelectorAll('span');
      
      // видалення вивчених сетів
      removeStudied.forEach((btn, index) => {
        allSpanStudied[index].textContent = index;
        btn.onclick = function(){
          let indx = parseInt(this.nextSibling.textContent);
          studied.splice(indx, 1);
          this.closest('.studied_block').remove();
          allSpanStudied = studiedTermsBox.querySelectorAll('span');
  
          for (let i = indx; i < studied.length; i++) {
            allSpanStudied[i].textContent = i;
          }
          localStorage.setItem('studied', JSON.stringify(studied));
        };
      });
      // кінець видалення вивчених сетів
    }
  }
}
// кінець відображення вивченних сетів


// перевірка LS та відображення сетів
function checkLS(){
  history.replaceState(null, null, ' ');
  if(localStorage.getItem('idTermsLS')){
    count = localStorage.getItem('idTermsLS');
  }else{
    count = zero;
  }

  if(localStorage.getItem('setsOfWords')){
    setsArr = JSON.parse(localStorage.getItem('setsOfWords'));
  
    for (let i = 0; i < setsArr.length; i++) {
      const divSets = document.createElement('div');
      openTermsBox.appendChild(divSets).classList.add('block');
      divSets.textContent = setsArr[i].name;

      const editBtn = document.createElement('button');
      const removeBtn = document.createElement('button');

      divSets.appendChild(editBtn).classList.add('edit_set_btn');
      divSets.appendChild(removeBtn).classList.add('remove_set_btn');

      editBtn.textContent = 'Edit';
      removeBtn.textContent = 'Remove';

      const span = document.createElement('span');
      divSets.appendChild(span);
    }

    const blocks = openTermsBox.querySelectorAll('.block');
    let allSpan = openTermsBox.querySelectorAll('span');

    // помітити сет вивченим
    blocks.forEach(block => {
      block.addEventListener('click', function(){

        let indx = parseInt(this.lastElementChild.textContent);
        setsArr[indx].studied = true;
        let studiedSet = setsArr.splice(indx, 1);
        studied.push(...studiedSet);
        this.remove();
        allSpan = openTermsBox.querySelectorAll('span');

        for (let i = indx; i < setsArr.length; i++) {
          allSpan[i].textContent = i;
        }

        localStorage.setItem('studied', JSON.stringify(studied));
        localStorage.setItem('setsOfWords', JSON.stringify(setsArr));

        const studiedBlocks = studiedTermsBox.querySelectorAll('.studied_block');
        studiedBlocks.forEach(block => {
          block.remove();
        });
        // кінець помітити сет вивченим

        renderStudied();
      });
    });

    const removeSets = openTermsBox.querySelectorAll('.remove_set_btn');
    let editSets = openTermsBox.querySelectorAll('.edit_set_btn');
    
    //видалення сетів
    removeSets.forEach((btn, index) => {
      allSpan[index].textContent = index;
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        let indx = parseInt(this.nextSibling.textContent);
        console.log(setsArr);
        setsArr.splice(indx, 1);
        console.log(setsArr);
        this.closest('.block').remove();
        allSpan = openTermsBox.querySelectorAll('span');

        for (let i = indx; i < setsArr.length; i++) {
          allSpan[i].textContent = i;
        }
        localStorage.setItem('setsOfWords', JSON.stringify(setsArr));
      });
    });
    //кінець видалення сетів

    
    editSets.forEach(btn => {
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        let indx = parseInt(this.nextSibling.nextSibling.textContent);
        mainPage.style.display = 'none';
        editPage.style.display = 'block';
        window.location.hash = `#/modify:item_${setsArr[indx].id}`;
      });
    });
    
  }else{
    setsArr = [];
  }
}
// кінець перевірка LS та відображення сетів


//редагування сетів
function modify(){
  let indxId = +window.location.hash.replace('#/modify:item_', '');
  let indx;

  for (let i = 0; i < setsArr.length; i++) {
    if(indxId === +setsArr[i].id){
      indx = i;
    }
  }

  const editName = document.createElement('input'),
        cancel = document.createElement('button'),
        saveChanges = document.createElement('button');

  editPage.appendChild(editName);
  editName.style.display = 'block';
  editName.value = setsArr[indx].name;

  editPage.appendChild(saveChanges);
  editPage.appendChild(cancel).id = 'editCancel';
  saveChanges.textContent = 'Save changes';
  cancel.textContent = 'Cancel';

  const editCancel = document.getElementById('editCancel');

  // відміна редагування
  editCancel.addEventListener('click', function(){
    this.previousSibling.previousSibling.remove();
    this.previousSibling.remove();
    this.remove();
    exit();
  });
  // кінець відміна редагування

  // відображення карток редагуючого сету
  for (let j = 0; j < setsArr[indx].arrOfTerms.length; j++) {
    const editBlock = document.createElement('div');
    
    editPage.appendChild(editBlock).classList.add('block');
    const editTermCreate = document.createElement('input'),
          editDefenitionCreate = document.createElement('input');
          
    editBlock.appendChild(editTermCreate).classList.add('edit_term');
    editBlock.appendChild(editDefenitionCreate).classList.add('edit_defenition');
    
    editTermCreate.value = setsArr[indx].arrOfTerms[j].term;
    editDefenitionCreate.value = setsArr[indx].arrOfTerms[j].defenition;
    // кінець відображення карток редагуючого сету

    // збереження відредагованих сетів
    saveChanges.onclick = function(){
      if(editName.value !== ''){

        const editTermQuery = document.querySelectorAll('.edit_term'),
              editDefenetionQuery = document.querySelectorAll('.edit_defenition');

        for (let i = 0; i < editTermQuery.length; i++) {
          setsArr[indx].arrOfTerms[i].term = editTermQuery[i].value;
          setsArr[indx].arrOfTerms[i].defenition = editDefenetionQuery[i].value;
        }

        setsArr[indx].name = editName.value;
        localStorage.setItem('setsOfWords', JSON.stringify(setsArr));
        this.previousSibling.remove();
        this.nextSibling.remove();
        this.remove();
        exit();
      }
    };
    //кінець збереження відредагованих сетів
  }
}
//кінець редагування сетів


function exit(){
  inputName.value = '';
  const blocks = document.querySelectorAll('.block');
  blocks.forEach(block => {
    block.remove();
  });
  addPage.style.display = 'none';
  editPage.style.display = 'none';
  mainPage.style.display = 'block';
  checkLS();
}


// додати новий сет
function addNewSet(){
  addBtn.onclick = () => {
    window.location.hash = '#/add';
  };
}
// кінець додати новий сет


// відміна створення нового сету
function cancel(){
  cancelBtn.onclick = function(){
    count--;
    localStorage.setItem('idTermsLS', count);
    exit();
  }
}
// кінець відміна створення нового сету


// ф-я конструктор
function MakeCard(id, name, termsArr, defenetionArr){
  let arrOfTerms = [];
  
  this.id = id;
  this.name = name;
  this.studied = false;
  for (let i = 0; i < termsArr.length; i++) {
    let objOfTerms = {};
    objOfTerms.term = termsArr[i].value;
    objOfTerms.defenition = defenetionArr[i].value;
    arrOfTerms.push(objOfTerms);
  }
    this.arrOfTerms = arrOfTerms;
}
// кінець ф-я конструктор


// збереження сету при створенні
function saveSet(){
  saveTerms.addEventListener('click', () => {
    let nameOfSet = inputName.value;
    const terms = document.querySelectorAll('.term');
    const defenetion = document.querySelectorAll('.defenetion');
    let booleanCounter = false;
    let notEmptyCounter = 0;

    terms.forEach((elem, index) => {
      if(nameOfSet !== '' && (elem.value !== '' || defenetion[index].value !== '')){
        booleanCounter = true;
        notEmptyCounter++;
      }
    });

    if(booleanCounter && notEmptyCounter === terms.length){
      let mySet = new MakeCard(count, nameOfSet, terms, defenetion);
        setsArr.push(mySet);
        localStorage.setItem('setsOfWords', JSON.stringify(setsArr));
        exit();
        history.replaceState(null, null, ' ');
    }
  });
}
// кінець збереження сету при створенні


// додати новий термін з визначенням
function addNewTerm(){
  addTerms.addEventListener('click', () => {
    const block = document.createElement('div');
    addPage.appendChild(block).classList.add('block');

    const inputTerm = document.createElement('input'),
          inputDefenition = document.createElement('input'),
          blocks = addPage.querySelectorAll('.block'),
          remove = document.createElement('button');

    blocks.forEach(block => {
      block.appendChild(inputTerm).classList.add('input_in_block');
      inputTerm.setAttribute('placeholder', 'enter term');
      inputTerm.classList.add('term');

      block.appendChild(inputDefenition).classList.add('input_in_block');
      inputDefenition.setAttribute('placeholder', 'enter defenition');
      inputDefenition.classList.add('defenetion');

      block.appendChild(remove).classList.add('remove_term_btn');
      remove.textContent = 'Remove';

      const removeBtns = document.querySelectorAll('.remove_term_btn');
      removeBtns.forEach(removeBtn => {
        removeBtn.onclick = function(){
          this.closest('.block').remove();
        }
      });
    });
  });
}
// кінець додати новий термін з визначенням


function locationHashChanged() {
  if (location.hash === '#/add') {
    mainPage.style.display = 'none';
    editPage.style.display = 'none';
    addPage.style.display = 'block';
    count++;
    addNewSet();
    cancel();
    localStorage.setItem('idTermsLS', count);
  }

  const spans = openTermsBox.querySelectorAll('span');
  spans.forEach(span => {
    if(location.hash === `#/modify:item_${setsArr[+span.textContent].id}`){
      mainPage.style.display = 'none';
      addPage.style.display = 'none';
      editPage.style.display = 'block';
      modify();
    }
  });
  
}

window.onhashchange = locationHashChanged;

checkLS();
addNewSet();
saveSet();
addNewTerm();
renderStudied();