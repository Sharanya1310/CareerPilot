import CompanyInfoService from "../services/companyInfoService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getCompanyInfo = asyncHandler(async (req, res) => {
  const { name } = req.params;
  if (!name || !name.trim()) throw new AppError("Company name is required", 400);

  try {
    const info = await CompanyInfoService.getCompanyInfo(name.trim());
    res.json({ success: true, company: name.trim(), info });
  } catch (err) {
    res.status(502).json({ success: false, message: err.message });
  }
});

export const listGeminiModels = asyncHandler(async (req, res) => {
  try {
    const data = await CompanyInfoService.listModels();
    const models = (data.models || []).map(m => m.name);
    res.json({ success: true, models });
  } catch (err) {
    res.status(502).json({ success: false, message: err.message });
  }
});
