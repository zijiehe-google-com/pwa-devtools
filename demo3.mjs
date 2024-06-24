import * as common from './common.mjs';
Object.assign(global, common);

(async () => {
  // TODO: Find an app that can open files.
  const url = 'https://notepad-isair.vercel.app/';
  console.log('This test will install ' + url + ' and open /tmp/test.txt ' +
              'and /tmp/test2.txt in it.');

  const default_param = {
    manifestId: url,
  };

  await send(null, 'PWA.install', {
    manifestId: url,
    installUrlOrBundleUrl: url
  });

  await send(await current_page_session(),
             'PWA.openCurrentPageInApp',
             default_param);

  await send(null, 'PWA.launchFilesInApp', {
    manifestId: url,
    files: ['/tmp/test.txt', '/tmp/test2.txt'],
  });

  await waitfor_enter('You should see the installed app opened the files. ' +
                      'Press any key to uninstall and exit.');

  await send(null, 'PWA.uninstall', default_param);
  browser.close();
  shutdown();
})();