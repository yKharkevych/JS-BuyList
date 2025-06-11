document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('item-input');
    const addBtn = document.getElementById('add-btn');
    const itemsContainer = document.getElementById('items');
    const leftList = document.getElementById('left-list');
    const boughtList = document.getElementById('bought-list');
  
    const items = [];
  
    function updateSummary() {
      leftList.innerHTML = '';
      boughtList.innerHTML = '';
      items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'summary-item';
        const name = document.createElement('span');
        name.textContent = item.name;
        if (item.bought) name.classList.add('crossed');
        const count = document.createElement('span');
        count.className = 'count-badge';
        count.textContent = item.count;
        row.append(name, count);
        if (item.bought) boughtList.appendChild(row);
        else leftList.appendChild(row);
      });
    }
  
    function createItemElement(item) {
      const div = document.createElement('div');
      div.className = 'item';
      if (item.bought) div.classList.add('bought');
  
      const nameSpan = document.createElement('span');
      nameSpan.className = 'item-name';
      nameSpan.textContent = item.name;
      if (item.bought) nameSpan.classList.add('crossed');
      div.appendChild(nameSpan);
  
      nameSpan.addEventListener('click', () => {
        if (item.bought) return;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'inline-input';
        input.value = item.name;
        div.replaceChild(input, nameSpan);
        input.focus();
        input.addEventListener('blur', finish);
        input.addEventListener('keydown', e => e.key === 'Enter' && input.blur());
  
        function finish() {
          const val = input.value.trim();
          if (val) item.name = val;
          nameSpan.textContent = item.name;
          div.replaceChild(nameSpan, input);
          updateSummary();
        }
      });
  
      const controls = document.createElement('div');
      controls.className = 'controls';
  
      const minus = document.createElement('button');
      minus.className = 'minus';
      minus.textContent = '−';
      minus.setAttribute('data-tooltip', 'Зменшити кількість');
      if (item.count === 1) minus.classList.add('light');
  
      const countBox = document.createElement('span');
      countBox.className = 'count-box';
      countBox.textContent = item.count;
  
      const plus = document.createElement('button');
      plus.className = 'plus';
      plus.textContent = '+';
      plus.setAttribute('data-tooltip', 'Збільшити кількість');
  
      if (item.bought) {
        controls.appendChild(countBox);
      } else {
        controls.appendChild(minus);
        controls.appendChild(countBox);
        controls.appendChild(plus);
      }
  
      minus.addEventListener('click', () => {
        if (item.count > 1) {
          item.count--;
          countBox.textContent = item.count;
          if (item.count === 1) minus.classList.add('light');
          updateSummary();
        }
      });
  
      plus.addEventListener('click', () => {
        item.count++;
        countBox.textContent = item.count;
        if (item.count > 1) minus.classList.remove('light');
        updateSummary();
      });
  
      div.appendChild(controls);
  
      const statusDiv = document.createElement('div');
      statusDiv.className = 'status';
      const statusBtn = document.createElement('button');
      statusBtn.className = 'status-btn';
      statusBtn.setAttribute('data-tooltip', 'Змінити статус');
      statusBtn.textContent = item.bought ? 'Не куплено' : 'Куплено';
      statusDiv.appendChild(statusBtn);
  
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '✖';
      deleteBtn.setAttribute('data-tooltip', 'Видалити');
      if (!item.bought) statusDiv.appendChild(deleteBtn);
      div.appendChild(statusDiv);
  
      statusBtn.addEventListener('click', () => {
        item.bought = !item.bought;
        if (item.bought) {
          nameSpan.classList.add('crossed');
          statusBtn.textContent = 'Не куплено';
          minus.remove();
          plus.remove();
          deleteBtn.remove();
          controls.innerHTML = `<span class="count-box">${item.count}</span>`;
        } else {
          nameSpan.classList.remove('crossed');
          statusBtn.textContent = 'Куплено';
          controls.innerHTML = '';
          controls.appendChild(minus);
          controls.appendChild(countBox);
          controls.appendChild(plus);
          if (item.count === 1) minus.classList.add('light');
          statusDiv.appendChild(deleteBtn);
        }
        updateSummary();
      });
  
      deleteBtn.addEventListener('click', () => {
        const idx = items.indexOf(item);
        if (idx > -1) items.splice(idx, 1);
        div.remove();
        updateSummary();
      });
  
      return div;
    }
  
    function addItem(name, count = 1, bought = false) {
      const item = { name, count, bought };
      items.push(item);
      const el = createItemElement(item);
      itemsContainer.appendChild(el);
      updateSummary();
    }
  
    addBtn.addEventListener('click', () => {
      const val = itemInput.value.trim();
      if (val) {
        addItem(val);
        itemInput.value = '';
        itemInput.focus();
      }
    });
  
    itemInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') addBtn.click();
    });
  
    function init() {
      addItem('Помідори', 2, true);
      addItem('Печиво', 2, false);
      addItem('Сир', 1, false);
    }
  
    init();
  });