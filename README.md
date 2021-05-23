# NodeJs E-commerce API
 A Production grade Advanced Node.js API with advanced and useful features.

## This API provides 
 
 ### Proper Error Handling
 
  Nodejs and  expressjs applications crash easily when the errors are not properly handled and proper response is not given to the client on each request. But here i am not only handling errors but also responding with error bodies based on their environment. With default expressjs client req errors can be  handled  easily but errors in third party npm packages are responded with server error or 500 status code.which is something that i think is not a good thing that user should get to know. The environment could be Production or Development in Development environment i am responding with a detailed error body. But in Production environment I am not leaking sensitive information about the errors to the client instead a beautiful error which is user friendly.


### Rate Limiting 
  Set The limit of number of request from The same IP
  
### Data Sanitization
  It will help us clean all the data that comes into the application from malicious code.  I am doing data sanitization against NoSql query injection and XSS.

  ## Environment Variables
  ```bash
  
  MONGO_URI
  JWT_SECRET 
  
  ```
## Run The Application

  First, run the development server:

```bash
npm run dev
```