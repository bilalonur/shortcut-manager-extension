const default_options = {
    background: false,
  };
  
  browser.commands.onCommand.addListener(async (command) => {
    console.log(`Command received: ${command}`);
    
    try {
      const options = await browser.storage.sync.get(default_options);
      console.log(`Options: ${JSON.stringify(options)}`);
  
      if (command == 'duplicate-tab') {
        const tabs = await browser.tabs.query({ currentWindow: true, highlighted: true });
        console.log(`Tabs to duplicate: ${tabs.length}`);
        
        if (tabs.length === 1) {
          const tab = tabs[0];
          const newTab = await browser.tabs.duplicate(tab.id);
          console.log(`Duplicated tab ID: ${newTab.id}`);
          
          if (tab.pinned) {
            await browser.tabs.update(newTab.id, { pinned: true });
            await browser.tabs.move(newTab.id, { index: tab.index + 1 });
          }
          
          if (options.background) {
            await browser.tabs.update(tab.id, { active: true });
          }
        } else {
          const pinnedTabs = tabs.filter((t) => t.pinned);
          const lastPinnedTab = pinnedTabs[pinnedTabs.length - 1];
          const lastTab = tabs[tabs.length - 1];
          const newTabs = [];
          let pinnedIndex = 0;
          let index = 0;
          let tabToActivate;
          let tabToDeactivate;
          
          for (const tab of tabs) {
            const newTab = await browser.tabs.duplicate(tab.id);
            newTabs.push(newTab);
            let newIndex;
            
            if (tab.pinned) {
              await browser.tabs.update(newTab.id, { pinned: true });
              newIndex = lastPinnedTab.index + pinnedIndex + 1;
              pinnedIndex++;
            } else {
              newIndex = pinnedTabs.length + lastTab.index + index + 1;
              index++;
            }
            
            await browser.tabs.move(newTab.id, { index: newIndex });
            
            if (tab.active) {
              tabToActivate = options.background ? tab : newTab;
            }
            
            if (options.background) {
              tabToDeactivate = newTab;
            }
          }
          
          for (const tab of options.background ? tabs : newTabs) {
            await browser.tabs.update(tab.id, { highlighted: true });
          }
          
          if (tabToDeactivate) {
            await browser.tabs.update(tabToDeactivate.id, { highlighted: false });
          }
          
          await browser.tabs.update(tabToActivate.id, { highlighted: false });
          await browser.tabs.update(tabToActivate.id, { highlighted: true });
        }
      } else if (command == 'open-new-tab') {
        console.log(`Executing open-new-tab command`);
        await browser.tabs.create({ active: true });
        console.log(`New tab opened`);
      }
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
    }
  });
  