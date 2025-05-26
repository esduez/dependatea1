import { Command } from 'commander';
import TeaIntegration from '../core/tea-integration';
import logger from '../utils/logger';

export default function setupUpdateCommand(program) {
  return new Command('update')
    .description('Update installed packages')
    .argument('[packages...]', 'Packages to update')
    .option('--global', 'Update global packages')
    .action(async (packages, options) => {
      const tea = new TeaIntegration();
      try {
        if (packages.length === 0) {
          // Update all logic
        } else {
          await Promise.all(
            packages.map(pkg => tea.installPackage(pkg))
          );
        }
        logger.success('Packages updated successfully');
      } catch (error) {
        logger.error(error.message);
        process.exit(1);
      }
    });
}
