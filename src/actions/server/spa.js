import { collections, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export const getService = async () => {
  try {
    const serviceCollection = dbConnect(collections.SPA);
    const services = await serviceCollection.find().toArray();
    const result = JSON.parse(JSON.stringify(services));
    return result;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const getServiceById = async (id) => {
  try {
    if (!id) return null;
    const serviceCollection = dbConnect(collections.SPA);
    
    let query = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
    }
    
    const service = await serviceCollection.findOne(query);
    if (!service) return null;
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error(`Error fetching service with id ${id}:`, error);
    return null;
  }
};

export const getPackageServices = async () => {
  try {
    const serviceCollection = dbConnect(collections.SPA);
    const packages = await serviceCollection
      .find({ category: 'Spa Package' })
      .toArray();
    return JSON.parse(JSON.stringify(packages));
  } catch (error) {
    console.error('Error fetching package services:', error);
    return [];
  }
};
