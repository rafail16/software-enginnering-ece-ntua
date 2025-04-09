const chalk = require('chalk')
const mysql = require('mysql')
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect =chai.expect()
chai.use(chaiHttp);

let admin_token = ''
var dbusers=mysql.createConnection({
    port:3300,
    host:'localhost',   
    user:'root',
    password:'password',
    database:'dbusers',
    multipleStatements:true
});

// Admin Activity --- Functionality and Unit Testing

describe(chalk.blue.bold('Admin: Use Case Testing\n'), () => {
      
//  before(() => User.findOneAndDelete({username: 'user'}).exec().then())

  // Login Admin

  it(chalk.cyan('Use Case 1:') + '  Login admin', (done) => {
      let user = {
        username: "admin",
        password: "321nimda"
      };
      chai.request(server)
      .post('/energy/api/login')
      .send(user)
      .end((err, res) => {
        res.should.exist
        res.should.have.status(200);
        res.body.should.have.property('token').that.is.a('string')
        admin_token = res.body.token
        done();
      })
    })

// Create new user
        
        it(chalk.cyan('Use Case 2:') + '  Create user without admin priviliges', (done) => {

          let user = {
            username: "thanos",
            email: "thanasakis@agel.com",
            password : "thanos",
            quota : '10'
          };
          
          chai.request(server)
          .post('/energy/api/Admin/users')
          .set('x-observatory-auth', admin_token)
          .send(user)
          .end((err, res) => {
            res.should.exist
            res.should.have.status(200);
            res.body.should.be.empty
            done();
          });
        });

    it(chalk.red('Error: 400') + '   Should not create user with duplicate credentials', (done) => {

      let user = {
        username: "thanos",
        email: "thanasakis@agel.com",
        password : "thanos",
        quota : '10'
      };
      
      chai.request(server)
      .post('/energy/api/Admin/users')
      .set('x-observatory-auth', admin_token)
      .send(user)
      .end((err, res) => {
        res.should.exist
        res.should.have.status(400);
        res.body.should.have.property("message").equals('Duplicate Credentials')
        done();
      });
    });
      // Get UserStatus

      it(chalk.cyan('Use Case 3:') + '  GET userstatus', (done) => {
          
          chai.request(server)
          .get(`/energy/api/Admin/users/user`)
          .set('x-observatory-auth', admin_token)
          .send()
          .end((err, res) => {
            res.should.exist
            res.should.have.status(200);
            res.body.should.not.be.null
            res.body.should.be.an('object');
            res.body.should.have
              .property('username').that.is.a('string')
              .equal('user')
            res.body.should.have
              .property('email').that.is.a('string')
              .equal('user@user.com')
            res.body.should.have
              .property('quota').that.is.a('string')
              .equal('5')
            done();
          });
        })
        // Modify User

        it(chalk.cyan('Use Case 4:') + '  Modify user credentials & Set quota = 10', (done) => {
          let user = { 
            email: "thanos@agel.com",
            password : "thanos",
            quota : '10'
          };
          
          chai.request(server)
          .put(`/energy/api/Admin/users/user`)
          .set('x-observatory-auth', admin_token)
          .send(user)
          .end((err, res) => {
            res.should.exist
            res.should.have.status(200);
            res.body.should.not.be.null
            res.body.should.be.an('object');
            res.body.should.have
              .property('email').that.is.a('string')
              .equal('moduser@user.com')
            res.body.should.have
              .property('password').that.is.a('string')
            res.body.should.have
              .property('quota').that.is.a('string')
              .equal('10')
            done()
          })
        })
      
      // Logout Admin

      it(chalk.cyan('Use Case 5:') + '  Logout admin', (done) => {
          chai.request(server)
          .post(`/energy/api/logout`)
          .set('x-observatory-auth', admin_token)
          .send()
          .end((err, res) => {
            res.should.exist
            res.should.have.status(200);
            res.body.should.be.empty
            done()
          })
        })
      });