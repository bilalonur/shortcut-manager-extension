const default_options = {
    background: false,
  };
  
  document.addEventListener('DOMContentLoaded', async () => {
    const commands = await browser.commands.getAll();
    for (const command of commands) {
      const shortcut = document.getElementById(`${command.name}-shortcut`);
      if (!shortcut) {
        continue;
      }
      shortcut.textContent = command.shortcut || 'Not Set Yet!';
    }
  
    const options = await browser.storage.sync.get(default_options);
    const background = document.getElementById('background');
    background.checked = options.background;
    background.addEventListener('change', () =>
      browser.storage.sync.set({
        background: background.checked,
      }),
    );
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('configure-button').addEventListener('click', function () {
      browser.runtime.openOptionsPage();
    });
    document.getElementById('changelog-link').addEventListener('click', function(e) {
      e.preventDefault();
      browser.runtime.sendMessage({action: "openChangelog"});
  });
  });
  

