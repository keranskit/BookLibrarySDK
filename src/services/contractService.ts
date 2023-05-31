import { ethers } from 'ethers';
import { INPUTS, NETWORKS } from '../constants/constants'
import { InvalidNetworkException } from "../exceptions/InvalidNetworkException";
import { InvalidEnvironmentDataException } from "../exceptions/InvalidEnvironmentDataException";
import { addBook, borrowBook, checkIsBookAvailable, checkIsBookRented, returnBook, getAllAvailableBooks } from "./contractInteractions";
import { InvalidInputException } from "../exceptions/InvalidInputException";

const bookLibraryJson = require('../contracts/BookLibrary.json');
const commands: { [key: string]: string; }  = {};
Object.assign(commands, Object.entries(INPUTS).forEach(([k, v]) => {commands[k] = v.command}));

export async function proceedCommand(contract: ethers.Contract, signer: ethers.Wallet, command: string, firstParam: string, secondParam: number) {
    switch (command) {
        case commands.ADD_BOOK:
            await addBook(contract, firstParam, secondParam);

            break;
        case commands.BORROW_BOOK:
            await borrowBook(contract, firstParam);

            break;
        case commands.RETURN_BOOK:
            await returnBook(contract, firstParam);

            break;
        case commands.GET_ALL_AVAILABLE_BOOKS:
            await getAllAvailableBooks(contract);

            break;
        case commands.CHECK_IS_BOOK_AVAILABLE:
            await checkIsBookAvailable(contract, firstParam);

            break;
        case commands.CHECK_IS_BOOK_RENTED:
            await checkIsBookRented(contract, signer, firstParam);

            break;
        default:
            throw new InvalidInputException('Unknown command');
    }
}

export function getProvider(network: string) {
    switch (network) {
        case NETWORKS.LOCALHOST:
            return new ethers.providers.JsonRpcProvider(process.env['LOCALHOST_NODE_URL']);
        case NETWORKS.SEPOLIA:
            return new ethers.providers.InfuraProvider('sepolia', process.env['INFURA_SEPOLIA_API_KEY']);
        default:
            throw new InvalidNetworkException(`Invalid network passed for getting provider`);
    }
}

export function getSigner(provider: ethers.providers.BaseProvider, network: string) {
    const priv = process.env[network.toUpperCase() + '_CONTRACT_OWNER_PRIVATE_KEY'];
    if (!priv) throw new InvalidEnvironmentDataException('No private key provided.');

    return new ethers.Wallet(priv, provider);
}

export function getContract(network: string, signer: ethers.Wallet) {
    const contractAddress = process.env[network + '_CONTRACT_ADDRESS'];
    if (!contractAddress) throw new InvalidEnvironmentDataException('No contract address provided.');

    return new ethers.Contract(contractAddress, bookLibraryJson.abi, signer);
}
