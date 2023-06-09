const express = require("express");
const {
    AddTransaction,
    getallTransaction,
    getSingleTransaction,
    updateTransation,
    deleteTransactionDetails,
    getSingleTransactionByReceiptId
} = require("../../routes/transaction/transaction.controller")

const router = express.Router();

router.post("/addtransaction", AddTransaction)
router.get("/List/:pageNo", getallTransaction)
router.get("/details/:id", getSingleTransaction)
router.get("/ReceiptId/:id", getSingleTransactionByReceiptId)
router.put("/update/:id", updateTransation)
router.delete("/delete/:id", deleteTransactionDetails)



module.exports = router;
