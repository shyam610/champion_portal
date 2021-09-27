const express=require('express');
const userController=require('../controllers/user_controller');
const adminController=require('../controllers/admin_controller');
const {auth,adminAauth}=require('../middleware/jwt_authentication')
const cronJob = require("cron").CronJob;
const router=express.Router();

router.get('/',(req,res)=>{
  res.send({message:"Home Page"})
})
router.post('/sign-up',userController.signUp);
router.post('/sign-in',userController.signIn);
router.post('/feedback/:id',auth,userController.feedback);
router.get('/get-list',auth,userController.getList);
router.patch('/change-password',auth,userController.changePassword)

//admin router
router.post('/admin/sign-up',adminController.signUp);
router.post('/admin/sign-in',adminController.signIn);
router.patch('/admin/add-tl/:id',adminAauth,adminController.addTL);
router.get('/get-lead',auth,adminController.getLead)



//TL router
router.patch('/assign-tl/:id',auth,adminController.assignTl);
router.get('/show-result',auth,adminController.showResult);
router.get('/history',auth,adminController.getHistory);


const job = new cronJob(
    "0 0 * * sat",
    //"* * * * *",
    userController.historyMantain,
    null,
    true,
    "Asia/Kolkata"
  );
  job.start();
router.get('/demo',userController.historyMantain);
module.exports=router;