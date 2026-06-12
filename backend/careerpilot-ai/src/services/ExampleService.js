/**
 * Example Service Pattern
 * 
 * Services contain business logic.
 * Controllers call services; services interact with models.
 * 
 * This keeps controllers thin and logic testable & reusable.
 * 
 * Usage in controller:
 *   const user = await UserService.findById(id);
 *   const jobs = await JobService.findByStatus('Applied');
 */

// import User from "../models/User.js";
// import AppError from "../utils/AppError.js";
// import { logger } from "../utils/logger.js";

/*
class ExampleService {
  /**
   * Find a resource by ID
   */
  // static async findById(id) {
  //   try {
  //     const item = await User.findById(id);
  //     if (!item) {
  //       throw new AppError("Resource not found", 404);
  //     }
  //     return item;
  //   } catch (error) {
  //     logger.error("Error fetching resource", { id, error: error.message });
  //     throw error;
  //   }
  // }

  /**
   * Find all resources with pagination
   */
  // static async findAll(filters = {}, page = 1, limit = 10) {
  //   const skip = (page - 1) * limit;
  //   const items = await User.find(filters).skip(skip).limit(limit);
  //   const total = await User.countDocuments(filters);

  //   return {
  //     items,
  //     pagination: {
  //       page,
  //       limit,
  //       total,
  //       pages: Math.ceil(total / limit),
  //     },
  //   };
  // }

  /**
   * Create a new resource
   */
  // static async create(data) {
  //   try {
  //     const item = new User(data);
  //     await item.save();
  //     logger.info("Resource created", { id: item._id });
  //     return item;
  //   } catch (error) {
  //     logger.error("Error creating resource", { error: error.message });
  //     throw error;
  //   }
  // }

  /**
   * Update a resource
   */
  // static async update(id, updateData) {
  //   const item = await this.findById(id);
  //   Object.assign(item, updateData);
  //   await item.save();
  //   logger.info("Resource updated", { id });
  //   return item;
  // }

  /**
   * Delete a resource
   */
  // static async delete(id) {
  //   const item = await this.findById(id);
  //   await User.findByIdAndDelete(id);
  //   logger.info("Resource deleted", { id });
  //   return item;
  // }
}

// export default ExampleService;
*/

export default {};
