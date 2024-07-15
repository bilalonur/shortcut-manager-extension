document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options-form').addEventListener('submit', saveOptions);

const shortcutButtons = document.querySelectorAll('.shortcut-btn');
shortcutButtons.forEach(button => button.addEventListener('click', handleShortcutButtonClick));

let currentButton = null;
let currentCombination = [];

function handleShortcutButtonClick(event) {
  event.preventDefault();
  
  if (currentButton && currentButton === event.target) {
    stopRecording();
  } else {
    startRecording(event.target);
  }
}

function startRecording(button) {
  if (currentButton) {
    stopRecording();
  }
  
  currentButton = button;
  button.textContent = 'Stop Set';
  currentCombination = [];
  const inputId = button.id.replace('-btn', '');
  const inputElement = document.getElementById(inputId);
  
  function handleKeydown(event) {
    if (currentButton !== button) return;
    
    const keyCombination = getKeyCombination(event);
    console.log(`Key combination captured: ${keyCombination}`);
    
    if (!currentCombination.includes(keyCombination) && isValidKey(keyCombination)) {
      currentCombination.push(keyCombination);
    }
    
    inputElement.value = currentCombination.join('+');
    console.log(`Current combination: ${inputElement.value}`);
    
    if (currentCombination.length >= 3 || isValidCombination(currentCombination)) {
      stopRecording();
    }
  }
  
  window.addEventListener('keydown', handleKeydown);
  
  button.handleKeydown = handleKeydown;
}

function stopRecording() {
  if (currentButton) {
    window.removeEventListener('keydown', currentButton.handleKeydown);
    currentButton.textContent = 'Set Shortcut';
    currentButton = null;
    currentCombination = [];
  }
}

function getKeyCombination(event) {
  const keys = [];
  if (event.altKey && !keys.includes('Alt')) keys.push('Alt');
  if (event.ctrlKey && !keys.includes('Ctrl')) keys.push('Ctrl');
  if (event.shiftKey && !keys.includes('Shift')) keys.push('Shift');
  
  const key = event.key.toUpperCase();
  if (!['ALT', 'CONTROL', 'SHIFT', 'META'].includes(key)) {
    keys.push(key);
  }
  
  return keys.join('+');
}

function isValidKey(key) {
  const valid = key.length > 0 && !['ALT', 'CONTROL', 'SHIFT', 'META'].includes(key);
  console.log(`Is valid key "${key}": ${valid}`);
  return valid;
}

function isValidCombination(combination) {
  const validModifiers = ['Alt', 'Ctrl', 'Shift', 'Meta'];
  const keys = combination.filter(key => !validModifiers.includes(key));
  const modifiers = combination.filter(key => validModifiers.includes(key));
  const valid = (modifiers.length >= 1 && modifiers.length <= 2) && keys.length === 1;
  console.log(`Is valid combination "${combination.join('+')}": ${valid}`);
  return valid;
}

function saveOptions(event) {
  event.preventDefault();

  const duplicateTab = document.getElementById('duplicate-tab').value;
  const openNewTab = document.getElementById('open-new-tab').value;

  const commands = {
    "duplicate-tab": {
      "suggested_key": { "default": duplicateTab },
      "description": "Duplicate the current tab"
    },
    "open-new-tab": {
      "suggested_key": { "default": openNewTab },
      "description": "Open a new tab"
    }
  };

  // Validate commands
  if (!validateCommands(commands)) {
    alert('Invalid key combinations. Please make sure to use a valid combination.');
    return;
  }

  browser.storage.sync.set({ commands }).then(() => {
    console.log('Options saved');
  });

  updateCommands(commands);
}

function restoreOptions() {
  browser.storage.sync.get('commands').then((result) => {
    const commands = result.commands || {
      "duplicate-tab": { "suggested_key": { "default": "Alt+Shift+D" } },
      "open-new-tab": { "suggested_key": { "default": "Ctrl+T" } }
    };

    document.getElementById('duplicate-tab').value = commands["duplicate-tab"].suggested_key.default;
    document.getElementById('open-new-tab').value = commands["open-new-tab"].suggested_key.default;
  });
}

function updateCommands(commands) {
  for (const command in commands) {
    const shortcut = commands[command].suggested_key.default;
    if (shortcut) {
      browser.commands.update({
        name: command,
        shortcut: shortcut
      }).then(() => {
        console.log(`${command} updated`);
      }).catch((error) => {
        console.error(`Error updating ${command}: `, error);
      });
    }
  }
}

function validateCommands(commands) {
  for (const command in commands) {
    const combination = commands[command].suggested_key.default;
    if (combination) { // Only validate non-empty combinations
      console.log(`Validating command "${command}" with combination: ${combination}`);
      if (!isValidCombination(combination.split('+'))) {
        console.log(`Invalid combination for command "${command}": ${combination}`);
        return false;
      }
    }
  }
  return true;
}
