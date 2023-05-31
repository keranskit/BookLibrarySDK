import { ethers } from 'ethers';

export async function addBook(contract: ethers.Contract, bookName: string, booksCount: number) {
    const addBookReceipt = await contract.addBook(bookName, booksCount);
    const addBookReceiptResult = await addBookReceipt.wait();
    const addBookGasUsed = ethers.utils.formatUnits(addBookReceiptResult.gasUsed, 'gwei');

    console.log(`Added book '${bookName}' in tx with hash ${addBookReceiptResult.transactionHash} in block ${addBookReceiptResult.blockNumber}; gas used: ${addBookGasUsed}`);
}

export async function borrowBook(contract: ethers.Contract, bookName: string) {
    const bookIdEncrypted = ethers.utils.solidityKeccak256(['string'], [bookName]);

    const borrowBookTransaction = await contract.borrowBook(bookIdEncrypted);
    const borrowBookReceipt = await borrowBookTransaction.wait();

    console.log(`Address: ${borrowBookReceipt.from} borrowed book ${bookName} in tx with hash ${borrowBookReceipt.transactionHash}`);
}

export async function returnBook(contract: ethers.Contract, bookName: string) {
    const bookIdEncrypted = ethers.utils.solidityKeccak256(['string'], [bookName]);

    const returnBookTransaction = await contract.returnBook(bookIdEncrypted);
    const returnBookReceipt = await returnBookTransaction.wait();

    console.log(`Address: ${returnBookReceipt.from} returned book ${bookName} in tx with hash ${returnBookReceipt.transactionHash}`);

}

export async function getAllAvailableBooks(contract: ethers.Contract, ) {
    const getAllAvailableBooksReceipt = await contract.getAvailableBooks();

    console.log(`Available books are: ${getAllAvailableBooksReceipt.map((a: { title: any; }) => a.title)}`);
}

export async function checkIsBookAvailable(contract: ethers.Contract, bookName: string) {
    const getAvailableBooksReceipt = await contract.getAvailableBooks();

    console.log(`Is the book available: ${!!(getAvailableBooksReceipt.find((a: { title: string; }) => a.title === bookName))}`);
}

export async function checkIsBookRented(contract: ethers.Contract, signer: ethers.Wallet, bookName: string) {
    const bookIdEncrypted = ethers.utils.solidityKeccak256(['string'], [bookName]);

    const bookBorrowersArray = await contract.getAllAddressesBorrowedBook(bookIdEncrypted);

    console.log(`Check if the address is rented the book: ${!!(bookBorrowersArray.find((a: string) => a === signer.address))}`);
}
