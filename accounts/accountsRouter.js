const router = require('express').Router();

const db = require('../data/dbConfig.js');

db.on('query', (toSqlObject) => {
    console.log(toSqlObject)
})

router.get('/', async (req, res) => {
   try {
        const accounts = await db('accounts');
        res.json(accounts)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Can't get accounts."})
    }
})

router.get('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id})
    .first()
    .then(account => {
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(404).json({ message: "Account not found." });
        }
    })
})

router.post('/', async (req, res) => {
    const accountData = req.body;

    try {
        const account = await db.insert(accountData).into('accounts')
        res.status(201).json(account)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "our bad! couldn't add account"})
    }
    // if (validAccount(req.bod)) {
    //     db('accounts')
    //         .insert(req.body, 'id')
    //         .then(([id]) => id)
    //         .then(id => {
    //             db('accounts')
    //                 .where({ id })
    //                 .first()
    //                 .then(account => {
    //                     res.status(201).json(account)
    //                 })
    //         })

    // }
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('accounts')
        .where({ id })
        .update(changes)
        .then(update => {
            if (update) {
                res.status(200).json({ updated: `You updated ${update} accounts.`})
            } else {
                res.status(404).json ({ message: 'invalid id' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Our bad!', error: err})
        })
})

router.delete('/:id', async (req, res) => {
    const { id } =  req.params;

    try {
        const count = await db.del().from('accounts').where({ id });
        count ? res.status(200).json({ message: `You deleted ${count} account.`})
            : res.status(404).json({ message: "Can't delete account. Maybe the Id is wrong?"})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Our bad! Somethign went wrong', message: error})
    }
})



function validAccount({ name, budget }) {
    return name && typeof budget == 'number' && budget >= 0;
}


module.exports = router;