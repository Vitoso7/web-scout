import { Test, TestingModule } from '@nestjs/testing';
import { HeadlessBrowserService } from './headless-browser.service';

describe('HeadlessBrowserService', () => {
  let service: HeadlessBrowserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadlessBrowserService],
    }).compile();

    service = module.get<HeadlessBrowserService>(HeadlessBrowserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
