const default_options = {
  background: false,
};
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "openChangelog") {
      browser.tabs.create({url: browser.runtime.getURL("CHANGELOG.md")});
  }
});
browser.commands.onCommand.addListener(async (command) => {
  console.log(`Command received: ${command}`);
  
  try {
    const options = await browser.storage.sync.get(default_options);
    console.log(`Options: ${JSON.stringify(options)}`);

    switch (command) {
      case 'duplicate-tab':
        await duplicateTab(options);
        break;
      case 'open-new-tab':
        await openNewTab();
        break;
      case 'open-recent-closed-tab':
        await openRecentClosedTab();
        break;
      case 'mute-tab':
        await muteTab();
        break;
    }
  } catch (error) {
    console.error(`Error executing command ${command}:`, error);
  }
});

async function duplicateTab(options) {
  // Existing duplicateTab functionality...
}

async function openNewTab() {
  console.log(`Executing open-new-tab command`);
  await browser.tabs.create({ active: true });
  console.log(`New tab opened`);
}

async function openRecentClosedTab() {
  console.log(`Executing open-recent-closed-tab command`);
  const recentlyClosed = await browser.sessions.getRecentlyClosed({ maxResults: 1 });
  if (recentlyClosed.length > 0) {
    const mostRecentTab = recentlyClosed[0];
    if (mostRecentTab.tab) {
      await browser.sessions.restore(mostRecentTab.tab.sessionId);
      console.log(`Restored recently closed tab: ${mostRecentTab.tab.url}`);
    } else {
      console.log(`No recently closed tab found`);
    }
  } else {
    console.log(`No recently closed sessions found`);
  }
}

async function muteTab() {
  console.log(`Executing mute-tab command`);
  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (activeTab) {
    const muted = !activeTab.mutedInfo.muted;
    await browser.tabs.update(activeTab.id, { muted });
    console.log(`Tab ${activeTab.id} ${muted ? 'muted' : 'unmuted'}`);
  } else {
    console.log(`No active tab found`);
  }
}
