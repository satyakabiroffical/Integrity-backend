
export const errorMiddleware = (err, req, res, next) => {

    res.status(500).json({ 
      success:false,
      message: err.message });
  };
  
  