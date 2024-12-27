// test/user.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');  // Đảm bảo đường dẫn đúng đến file server.js
const expect = chai.expect;

chai.use(chaiHttp);

describe('User API', () => {

  // Test GET /api/users
  describe('GET /api/users', () => {
    it('should return a list of users', (done) => {
      chai.request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.above(0);  // Kiểm tra nếu có dữ liệu trả về
          done();
        });
    });

    it('should return 404 if no users found', (done) => {
      // Giả sử API trả về 404 nếu không có người dùng
      chai.request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // Test POST /api/users
  describe('POST /api/users', () => {
    it('should create a new user', (done) => {
      const newUser = {
        fullName: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "employee",
        departmentId: "1",  // Giả sử departmentId tồn tại
        position: "Developer",
        phone: "1234567890",
        dob: "1990-01-01",
        address: "123 Main St",
        dateOfJoining: "2022-01-01",
        isActive: true
      };

      chai.request(app)
        .post('/api/users')
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(201);  // Kiểm tra mã trạng thái trả về
          expect(res.body).to.have.property('fullName').eql('John Doe');
          expect(res.body).to.have.property('email').eql('john.doe@example.com');
          done();
        });
    });

    it('should return 400 if email is already registered', (done) => {
      const newUser = {
        fullName: "Jane Doe",
        email: "john.doe@example.com",  // Email đã đăng ký
        password: "password123",
        role: "employee",
        departmentId: "1",
        position: "Manager",
        phone: "9876543210",
        dob: "1992-01-01",
        address: "456 Main St",
        dateOfJoining: "2022-02-01",
        isActive: true
      };

      chai.request(app)
        .post('/api/users')
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(400);  // Kiểm tra mã lỗi nếu email đã tồn tại
          expect(res.body.message).to.include('Email này đã được đăng ký.');
          done();
        });
    });
  });

  // Test DELETE /api/users/:id
  describe('DELETE /api/users/:id', () => {
    it('should delete a user', (done) => {
      // Giả sử bạn có userId hợp lệ từ cơ sở dữ liệu
      const userId = 'validUserIdHere';  // Thay bằng userId thực tế

      chai.request(app)
        .delete(`/api/users/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('User soft deleted successfully');
          done();
        });
    });

    it('should return 404 if user not found', (done) => {
      const invalidUserId = 'invalidUserId';  // User không tồn tại

      chai.request(app)
        .delete(`/api/users/${invalidUserId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.eql('User not found');
          done();
        });
    });
  });

});
