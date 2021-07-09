const test = async (req, res) => {
  res.status(200).json({
    result: true,
    message: 'success',
  });
};

export default { test };
