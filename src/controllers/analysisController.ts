import { Request, Response } from 'express';
import Analysis from '../models/Analysis';
import { analyzeText, getImprovedText } from '../services/aiService';

/**
 * Analyze negotiation text
 * @route POST /api/analysis
 * @access Private
 */
export const createAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, modelId } = req.body;

    if (!text || !modelId) {
      res.status(400).json({
        success: false,
        message: 'Text and modelId are required'
      });
      return;
    }

    // Call AI service to analyze text
    const analysisResult = await analyzeText(text, modelId);

    // Create new analysis in database
    const analysis = await Analysis.create({
      userId: req.user._id,
      originalText: text,
      modelId,
      ...analysisResult
    });

    res.status(201).json({
      success: true,
      analysis
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get improved version of negotiation text
 * @route POST /api/analysis/improve
 * @access Private
 */
export const improveText = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, modelId, analysisId } = req.body;

    if (!text || !modelId) {
      res.status(400).json({
        success: false,
        message: 'Text and modelId are required'
      });
      return;
    }

    // Call AI service to get improved text
    const improvedText = await getImprovedText(text, modelId);

    // If analysisId is provided, update the analysis with improved text
    if (analysisId) {
      await Analysis.findByIdAndUpdate(
        analysisId,
        { improvedText },
        { new: true }
      );
    }

    res.json({
      success: true,
      improvedText
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get all analyses for the current user
 * @route GET /api/analysis
 * @access Private
 */
export const getAnalyses = async (req: Request, res: Response): Promise<void> => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get a single analysis by ID
 * @route GET /api/analysis/:id
 * @access Private
 */
export const getAnalysisById = async (req: Request, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
      return;
    }

    // Check if the analysis belongs to the user
    if (analysis.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this analysis'
      });
      return;
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Delete an analysis
 * @route DELETE /api/analysis/:id
 * @access Private
 */
export const deleteAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
      return;
    }

    // Check if the analysis belongs to the user
    if (analysis.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this analysis'
      });
      return;
    }

    await analysis.deleteOne();

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};
