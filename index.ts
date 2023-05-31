import { config } from 'dotenv';
import { validateNetwork, validateCommand, validateDotEnvFile } from './src/validations/validator';
import { getContract, getProvider, getSigner, proceedCommand } from "./src/services/contractService";

config();
export async function main() {
    const network: string = process.argv[2].toLowerCase();
    const command: string = process.argv[3];
    const firstParam: string = process.argv[4] || '';
    const secondParam: number = Number(process.argv[5]) || 0;

    validateNetwork(network);
    validateCommand(command, firstParam, secondParam);
    validateDotEnvFile(network);

    const provider = getProvider(network);
    const signer = getSigner(provider, network);
    const contract = getContract(network, signer);

    await proceedCommand(contract, signer, command, firstParam, secondParam);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
