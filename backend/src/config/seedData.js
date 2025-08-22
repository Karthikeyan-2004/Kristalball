const dotenv = require('dotenv');
const { connectDB, logger } = require('./database');
const User = require('../models/User');
const Asset = require('../models/Asset');

dotenv.config();

const seedData = async () => {
  try {
    console.log('Starting seed process...');
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully');

    try {
      await User.collection.drop();
      logger.info('Dropped users collection');
    } catch (error) {
      logger.info('Users collection does not exist, continuing...');
    }

    try {
      await Asset.collection.drop();
      logger.info('Dropped assets collection');
    } catch (error) {
      logger.info('Assets collection does not exist, continuing...');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logger.info('Collections and indexes prepared');

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@military.gov',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      assignedBase: 'All Bases'
    });

    logger.info(`Admin user created: ${admin.email}`);

    const baseCommanders = await User.create([
      {
        name: 'Colonel Karthi',
        email: 'karthi@military.gov',
        password: 'Password@123',
        role: 'base_commander',
        assignedBase: 'Base Alpha',
        createdBy: admin._id
      },
      {
        name: 'Colonel Imman',
        email: 'imman@military.gov',
        password: 'Password@123',
        role: 'base_commander',
        assignedBase: 'Base Beta',
        createdBy: admin._id
      },
      {
        name: 'Colonel kaviya',
        email: 'kaviya@military.gov',
        password: 'Password@123',
        role: 'base_commander',
        assignedBase: 'Base Gamma',
        createdBy: admin._id
      }
    ]);

    logger.info(`Created ${baseCommanders.length} base commanders`);

    const logisticsOfficers = await User.create([
      {
        name: 'Major kavya',
        email: 'kavya@military.gov',
        password: 'Password@123',
        role: 'logistics_officer',
        assignedBase: 'All Bases',
        createdBy: admin._id
      },
      {
        name: 'Captain lipiga',
        email: 'lipiga@military.gov',
        password: 'Password@123',
        role: 'logistics_officer',
        assignedBase: 'All Bases',
        createdBy: admin._id
      }
    ]);

    logger.info(`Created ${logisticsOfficers.length} logistics officers`);

    const sampleAssets = [
      {
        assetId: 'A001',
        name: 'M4A1 Carbine',
        category: 'Weapons',
        currentBase: 'Base Alpha',
        status: 'available',
        condition: 'excellent',
        quantity: 50,
        unitValue: 1200,
        description: 'Standard infantry rifle',
        manufacturer: 'Colt',
        model: 'M4A1',
        createdBy: admin._id
      },
      {
        assetId: 'V001',
        name: 'Humvee M1025',
        category: 'Vehicles',
        currentBase: 'Base Alpha',
        status: 'assigned',
        condition: 'good',
        quantity: 5,
        unitValue: 85000,
        description: 'High Mobility Multipurpose Wheeled Vehicle',
        manufacturer: 'AM General',
        model: 'M1025',
        assignedTo: {
          personnelName: 'Sergeant Miller',
          personnelRank: 'Sergeant',
          assignmentDate: new Date('2024-01-15'),
          assignmentPurpose: 'Patrol duties'
        },
        createdBy: admin._id
      },
      {
        assetId: 'C001',
        name: 'AN/PRC-152 Radio',
        category: 'Communication Equipment',
        currentBase: 'Base Alpha',
        status: 'available',
        condition: 'excellent',
        quantity: 25,
        unitValue: 4500,
        description: 'Handheld multiband, tactical software-defined radio',
        manufacturer: 'Harris Corporation',
        model: 'AN/PRC-152',
        createdBy: admin._id
      },

      {
        assetId: 'A002',
        name: 'M249 SAW',
        category: 'Weapons',
        currentBase: 'Base Beta',
        status: 'maintenance',
        condition: 'fair',
        quantity: 15,
        unitValue: 4200,
        description: 'Squad Automatic Weapon',
        manufacturer: 'FN Herstal',
        model: 'M249',
        createdBy: admin._id
      },
      {
        assetId: 'P001',
        name: 'IBA Body Armor',
        category: 'Protective Gear',
        currentBase: 'Base Beta',
        status: 'available',
        condition: 'good',
        quantity: 100,
        unitValue: 850,
        description: 'Interceptor Body Armor',
        manufacturer: 'Point Blank',
        model: 'IBA',
        createdBy: admin._id
      },
      {
        assetId: 'M001',
        name: 'Combat Medical Kit',
        category: 'Medical Supplies',
        currentBase: 'Base Beta',
        status: 'available',
        condition: 'excellent',
        quantity: 75,
        unitValue: 150,
        description: 'Individual First Aid Kit',
        manufacturer: 'North American Rescue',
        model: 'IFAK',
        createdBy: admin._id
      },

      {
        assetId: 'AM001',
        name: '5.56mm NATO Ammunition',
        category: 'Ammunition',
        currentBase: 'Base Gamma',
        status: 'available',
        condition: 'excellent',
        quantity: 10000,
        unitValue: 0.75,
        description: 'Standard rifle ammunition',
        manufacturer: 'Federal',
        model: '5.56x45mm',
        createdBy: admin._id
      },
      {
        assetId: 'V002',
        name: 'Bradley M2A3',
        category: 'Vehicles',
        currentBase: 'Base Gamma',
        status: 'available',
        condition: 'good',
        quantity: 3,
        unitValue: 3200000,
        description: 'Infantry Fighting Vehicle',
        manufacturer: 'BAE Systems',
        model: 'M2A3',
        createdBy: admin._id
      },
      {
        assetId: 'NV001',
        name: 'AN/PVS-14 Night Vision',
        category: 'Other',
        currentBase: 'Base Gamma',
        status: 'assigned',
        condition: 'excellent',
        quantity: 30,
        unitValue: 3500,
        description: 'Monocular Night Vision Device',
        manufacturer: 'ITT Exelis',
        model: 'AN/PVS-14',
        assignedTo: {
          personnelName: 'Lieutenant Taylor',
          personnelRank: 'Lieutenant',
          assignmentDate: new Date('2024-01-20'),
          assignmentPurpose: 'Night operations training'
        },
        createdBy: admin._id
      }
    ];

    const assets = await Asset.create(sampleAssets);
    logger.info(`Created ${assets.length} sample assets`);

    for (const asset of assets) {
      asset.addHistoryEntry('created', admin._id, 'Initial asset creation during system setup');
      if (asset.status === 'assigned') {
        asset.addHistoryEntry('assigned', admin._id, `Assigned to ${asset.assignedTo.personnelName}`);
      }
      await asset.save();
    }

    logger.info('Seed data creation completed successfully');
    
    console.log('\n=== SEED DATA CREATION COMPLETED ===');
    console.log('\nDefault Admin Credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    
    console.log('\nBase Commander Credentials:');
    baseCommanders.forEach(commander => {
      console.log(`${commander.name} (${commander.assignedBase}): ${commander.email} / Password@123`);
    });
    
    console.log('\nLogistics Officer Credentials:');
    logisticsOfficers.forEach(officer => {
      console.log(`${officer.name}: ${officer.email} / Password@123`);
    });
    
    console.log('\n=== RBAC PERMISSIONS SUMMARY ===');
    console.log('Admin: Full access to all data and operations');
    console.log('Base Commander: Access to data and operations for their assigned base');
    console.log('Logistics Officer: Limited access to purchases and transfers');
    
    process.exit(0);

  } catch (error) {
    logger.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
