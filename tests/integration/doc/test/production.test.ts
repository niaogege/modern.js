import path, { join } from 'path';
import { Page } from 'puppeteer';
import {
  getPort,
  killApp,
  modernBuild,
  modernServe,
} from '../../../utils/modernTestUtils';

const fixtureDir = path.resolve(__dirname, '../fixtures');

describe('Check production build', () => {
  let app: any;
  let appDir: string;
  let appPort: number;

  beforeAll(async () => {
    appDir = join(fixtureDir, 'base');

    await modernBuild(appDir);
    app = await modernServe(appDir, (appPort = await getPort()), {
      cwd: appDir,
    });
  });

  afterAll(async () => {
    await killApp(app);
  });

  it('check whether the page can be interacted', async () => {
    const page: Page = await (global as any).__BROWSER_GLOBAL__.newPage();
    await page.goto(`http://localhost:${appPort}`, {
      waitUntil: ['networkidle0'],
    });
    const darkModeButton = await page.$('.modern-nav-appearance');
    const html = await page.$('html');
    let htmlClass = await page.evaluate(
      html => html?.getAttribute('class'),
      html,
    );
    const defaultMode = htmlClass?.includes('dark') ? 'dark' : 'light';
    await darkModeButton?.click();
    // check the class in html
    htmlClass = await page.evaluate(html => html?.getAttribute('class'), html);
    expect(htmlClass?.includes('dark')).toBe(defaultMode !== 'dark');
    await page.close();
  });
});
