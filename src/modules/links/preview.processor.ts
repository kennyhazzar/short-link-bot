import { Job } from 'bull';
import { getLinkPreview } from 'link-preview-js';
import { JobGetLinkPreview } from '../../common';
import { UpdateLinkDto } from './dto';
import { Logger } from '@nestjs/common';
import { LinksService } from './links.service';
import { Process, Processor } from '@nestjs/bull';

@Processor('preview_queue')
export class PreviewConsumer {
  constructor(private readonly linkService: LinksService) {}
  private readonly logger = new Logger(PreviewConsumer.name);

  @Process()
  async processLinkPreview(job: Job<JobGetLinkPreview>) {
    const startTime = new Date().getTime();

    const { alias, url } = job.data;
    const languageCode = job.data?.languageCode;
    try {
      const headers: Record<string, string> = {
        'user-agent': 'googlebot',
      };

      if (languageCode) {
        headers['Accept-Language'] = languageCode;
      }

      const data = (await getLinkPreview(url, {
        followRedirects: 'follow',
        handleRedirects: (baseURL: string, forwardedURL: string) => {
          const urlObj = new URL(baseURL);
          const forwardedURLObj = new URL(forwardedURL);
          if (
            forwardedURLObj.hostname === urlObj.hostname ||
            forwardedURLObj.hostname === 'www.' + urlObj.hostname ||
            'www.' + forwardedURLObj.hostname === urlObj.hostname
          ) {
            return true;
          } else {
            return false;
          }
        },
        headers,
        timeout: 1200,
      })) as unknown as UpdateLinkDto;

      data.url = url;

      this.logger.warn(
        `worker process_link_preview (alias: ${job.data.alias}): ${
          new Date().getTime() - startTime
        } ms`,
      );

      this.linkService.updateLinkByAlias(alias, data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
