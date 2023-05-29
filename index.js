const { ethers } = require("ethers");
const { config: dotEnvConfig } = require('dotenv')
const bookLibraryJson = require('./contracts/BookLibrary.json')

dotEnvConfig();

const run = async function () {
    const network = process.argv[2].toUpperCase();
    if (network !== 'SEPOLIA' && network !== 'LOCAL') {
        console.log('Please use `node index.js local` or `node index.js sepolia`');
        process.exit(1);
    }

    let provider;
    if (network === 'LOCAL') {
        provider = new ethers.providers.JsonRpcProvider(process.env['LOCAL_NODE_URL']);
    } else if (network === 'SEPOLIA') {
        provider = new ethers.providers.InfuraProvider('sepolia', process.env['INFURA_SEPOLIA_API_KEY']);
    }

    const signer = new ethers.Wallet(process.env[network + '_CONTRACT_OWNER_PRIV_KEY'], provider);

    // const balance = await provider.getBalance(signer.address);

    const bookLibraryContract = new ethers.Contract(process.env[network + '_CONTRACT_ADDRESS'], bookLibraryJson.abi, signer);

    const bookNameString = 'asdasd';

    const addBookReceipt = await bookLibraryContract.addBook(bookNameString, 1);
    const addBookReceiptResult = await addBookReceipt.wait();
    const addBookGasUsed = ethers.utils.formatUnits(addBookReceiptResult.gasUsed, 'gwei');

    console.log(`Added book '${bookNameString}' in tx with hash ${addBookReceiptResult.transactionHash} in block ${addBookReceiptResult.blockNumber}; gas used: ${addBookGasUsed}`);

    const getAllAvailableBooksReceipt = await bookLibraryContract.getAvailableBooks();

    console.log(`Available books are: ${getAllAvailableBooksReceipt.map(a => a.title)}`);

    const bookIdEncrypted = ethers.utils.solidityKeccak256(['string'], [bookNameString]);

    const borrowBookTransaction = await bookLibraryContract.borrowBook(bookIdEncrypted);
    const borrowBookReceipt = await borrowBookTransaction.wait();

    console.log(`Address: ${borrowBookReceipt.from} borrowed book ${bookNameString} in tx with hash ${borrowBookReceipt.transactionHash}`);

    const bookBorrowersArray = await bookLibraryContract.getAllAddressesBorrowedBook(bookIdEncrypted);

    console.log(`Check if the address is rented the book: ${!!(bookBorrowersArray.find(a => a === signer.address))}`);

    const returnBookTransaction = await bookLibraryContract.returnBook(bookIdEncrypted);
    const returnBookReceipt = await returnBookTransaction.wait();

    console.log(`Address: ${returnBookReceipt.from} returned book ${bookNameString} in tx with hash ${returnBookReceipt.transactionHash}`);

    const getAvailableBooksReceipt = await bookLibraryContract.getAvailableBooks();

    console.log(`Is the book available: ${!!(getAvailableBooksReceipt.find(a => a.title === bookNameString))}`);
};
run();
