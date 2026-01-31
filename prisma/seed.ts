import { PrismaClient, ComplaintStatus, Priority, SeatType, Gender, ReservationStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Create States
    console.log('📍 Creating states...')
    const up = await prisma.state.upsert({
        where: { code: 'UP' },
        update: {},
        create: { name: 'Uttar Pradesh', code: 'UP' }
    })
    const mh = await prisma.state.upsert({
        where: { code: 'MH' },
        update: {},
        create: { name: 'Maharashtra', code: 'MH' }
    })
    const dl = await prisma.state.upsert({
        where: { code: 'DL' },
        update: {},
        create: { name: 'Delhi', code: 'DL' }
    })
    const mp = await prisma.state.upsert({
        where: { code: 'MP' },
        update: {},
        create: { name: 'Madhya Pradesh', code: 'MP' }
    })
    const bihar = await prisma.state.upsert({
        where: { code: 'BR' },
        update: {},
        create: { name: 'Bihar', code: 'BR' }
    })
    const jharkhand = await prisma.state.upsert({
        where: { code: 'JH' },
        update: {},
        create: { name: 'Jharkhand', code: 'JH' }
    })
    const assam = await prisma.state.upsert({
        where: { code: 'AS' },
        update: {},
        create: { name: 'Assam', code: 'AS' }
    })
    const arunachalPradesh = await prisma.state.upsert({
        where: { code: 'AR' },
        update: {},
        create: { name: 'Arunachal Pradesh', code: 'AR' }
    })
    const rajasthan = await prisma.state.upsert({
        where: { code: 'RJ' },
        update: {},
        create: { name: 'Rajasthan', code: 'RJ' }
    })
    const odisha = await prisma.state.upsert({
        where: { code: 'OD' },
        update: {},
        create: { name: 'Odisha', code: 'OD' }
    })
    const gujarat = await prisma.state.upsert({
        where: { code: 'GJ' },
        update: {},
        create: { name: 'Gujarat', code: 'GJ' }
    })
    const karnataka = await prisma.state.upsert({
        where: { code: 'KA' },
        update: {},
        create: { name: 'Karnataka', code: 'KA' }
    })
    const tamilNadu = await prisma.state.upsert({
        where: { code: 'TN' },
        update: {},
        create: { name: 'Tamil Nadu', code: 'TN' }
    })
    const chattisgarh = await prisma.state.upsert({
        where: { code: 'CG' },
        update: {},
        create: { name: 'Chhattisgarh', code: 'CG' }
    })
    const uttarakhand = await prisma.state.upsert({
        where: { code: 'UK' },
        update: {},
        create: { name: 'Uttarakhand', code: 'UK' }
    })
    const himachalPradesh = await prisma.state.upsert({
        where: { code: 'HP' },
        update: {},
        create: { name: 'Himachal Pradesh', code: 'HP' }
    })
    const jammuAndKashmir = await prisma.state.upsert({
        where: { code: 'JK' },
        update: {},
        create: { name: 'Jammu and Kashmir', code: 'JK' }
    })
    const punjab = await prisma.state.upsert({
        where: { code: 'PB' },
        update: {},
        create: { name: 'Punjab', code: 'PB' }
    })
    const haryana = await prisma.state.upsert({
        where: { code: 'HR' },
        update: {},
        create: { name: 'Haryana', code: 'HR' }
    })
    const sikkim = await prisma.state.upsert({
        where: { code: 'SK' },
        update: {},
        create: { name: 'Sikkim', code: 'SK' }
    })
    const kerala = await prisma.state.upsert({
        where: { code: 'KL' },
        update: {},
        create: { name: 'Kerala', code: 'KL' }
    })
    const westbengal = await prisma.state.upsert({
        where: { code: 'WB' },
        update: {},
        create: { name: 'West Bengal', code: 'WB' }
    })
    const tripura = await prisma.state.upsert({
        where: { code: 'TR' },
        update: {},
        create: { name: 'Tripura', code: 'TR' }
    })
    const telangana = await prisma.state.upsert({
        where: { code: 'TS' },
        update: {},
        create: { name: 'Telangana', code: 'TS' }
    })

    // ============================================
    // POLITICAL PARTIES
    // ============================================
    console.log('🏛️ Creating political parties...')
    const bjp = await prisma.politicalParty.upsert({
        where: { shortName: 'BJP' },
        update: {},
        create: {
            id: 'party-bjp',
            name: 'Bharatiya Janata Party',
            shortName: 'BJP',
            symbol: 'Lotus',
            color: '#FF9933',
            foundedYear: 1980,
            ideology: 'Right-wing, Hindu nationalism, Conservatism',
            isActive: true
        }
    })

    const inc = await prisma.politicalParty.upsert({
        where: { shortName: 'INC' },
        update: {},
        create: {
            id: 'party-inc',
            name: 'Indian National Congress',
            shortName: 'INC',
            symbol: 'Hand',
            color: '#138808',
            foundedYear: 1885,
            ideology: 'Centre-left, Secularism, Social democracy',
            isActive: true
        }
    })

    const sp = await prisma.politicalParty.upsert({
        where: { shortName: 'SP' },
        update: {},
        create: {
            id: 'party-sp',
            name: 'Samajwadi Party',
            shortName: 'SP',
            symbol: 'Bicycle',
            color: '#FF0000',
            foundedYear: 1992,
            ideology: 'Centre-left, Democratic socialism',
            isActive: true
        }
    })

    const bsp = await prisma.politicalParty.upsert({
        where: { shortName: 'BSP' },
        update: {},
        create: {
            id: 'party-bsp',
            name: 'Bahujan Samaj Party',
            shortName: 'BSP',
            symbol: 'Elephant',
            color: '#0066CC',
            foundedYear: 1984,
            ideology: 'Ambedkarism, Social equality',
            isActive: true
        }
    })

    const aap = await prisma.politicalParty.upsert({
        where: { shortName: 'AAP' },
        update: {},
        create: {
            id: 'party-aap',
            name: 'Aam Aadmi Party',
            shortName: 'AAP',
            symbol: 'Broom',
            color: '#00BFFF',
            foundedYear: 2012,
            ideology: 'Populism, Anti-corruption',
            isActive: true
        }
    })

    const ncp = await prisma.politicalParty.upsert({
        where: { shortName: 'NCP' },
        update: {},
        create: {
            id: 'party-ncp',
            name: 'Nationalist Congress Party',
            shortName: 'NCP',
            symbol: 'Clock',
            color: '#0066FF',
            foundedYear: 1999,
            ideology: 'Centre-left, Social democracy',
            isActive: true
        }
    })

    // Create Districts
    console.log('📍 Creating districts...')
    const prayagraj = await prisma.district.upsert({
        where: { id: 'prayagraj-dist' },
        update: {},
        create: { id: 'prayagraj-dist', name: 'Prayagraj', stateId: up.id }
    })
    const lucknow = await prisma.district.upsert({
        where: { id: 'lucknow-dist' },
        update: {},
        create: { id: 'lucknow-dist', name: 'Lucknow', stateId: up.id }
    })
    const varanasi = await prisma.district.upsert({
        where: { id: 'varanasi-dist' },
        update: {},
        create: { id: 'varanasi-dist', name: 'Varanasi', stateId: up.id }
    })
    const mumbai = await prisma.district.upsert({
        where: { id: 'mumbai-dist' },
        update: {},
        create: { id: 'mumbai-dist', name: 'Mumbai', stateId: mh.id }
    })
    const surat = await prisma.district.upsert({
        where: { id: 'surat-dist' },
        update: {},
        create: { id: 'surat-dist', name: 'Surat', stateId: gujarat.id }
    })
    const jaipur = await prisma.district.upsert({
        where: { id: 'jaipur-dist' },
        update: {},
        create: { id: 'jaipur-dist', name: 'Jaipur', stateId: rajasthan.id }
    })
    const chennai = await prisma.district.upsert({
        where: { id: 'chennai-dist' },
        update: {},
        create: { id: 'chennai-dist', name: 'Chennai', stateId: tamilNadu.id }
    })
    const hyderabad = await prisma.district.upsert({
        where: { id: 'hyderabad-dist' },
        update: {},
        create: { id: 'hyderabad-dist', name: 'Hyderabad', stateId: telangana.id }
    })
    const bangalore = await prisma.district.upsert({
        where: { id: 'bangalore-dist' },
        update: {},
        create: { id: 'bangalore-dist', name: 'Bangalore', stateId: karnataka.id }
    })
    const udaipur = await prisma.district.upsert({
        where: { id: 'udaipur-dist' },
        update: {},
        create: { id: 'udaipur-dist', name: 'Udaipur', stateId: rajasthan.id }
    })
    const kanpur = await prisma.district.upsert({
        where: { id: 'kanpur-dist' },
        update: {},
        create: { id: 'kanpur-dist', name: 'Kanpur', stateId: up.id }
    })
    const nagpur = await prisma.district.upsert({
        where: { id: 'nagpur-dist' },
        update: {},
        create: { id: 'nagpur-dist', name: 'Nagpur', stateId: mh.id }
    })
    const pune = await prisma.district.upsert({
        where: { id: 'pune-dist' },
        update: {},
        create: { id: 'pune-dist', name: 'Pune', stateId: mh.id }
    })
    const gorakhpur = await prisma.district.upsert({
        where: { id: 'gorakhpur-dist' },
        update: {},
        create: { id: 'gorakhpur-dist', name: 'Gorakhpur', stateId: up.id }
    })
    const azamgarh = await prisma.district.upsert({
        where: { id: 'azamgarh-dist' },
        update: {},
        create: { id: 'azamgarh-dist', name: 'Azamgarh', stateId: up.id }
    })
    const nashik = await prisma.district.upsert({
        where: { id: 'nashik-dist' },
        update: {},
        create: { id: 'nashik-dist', name: 'Nashik', stateId: mh.id }
    })
    const kolkata = await prisma.district.upsert({
        where: { id: 'kolkata-dist' },
        update: {},
        create: { id: 'kolkata-dist', name: 'Kolkata', stateId: westbengal.id }
    })
    const siliguri = await prisma.district.upsert({
        where: { id: 'siliguri-dist' },
        update: {},
        create: { id: 'siliguri-dist', name: 'Siliguri', stateId: westbengal.id }
    })
    const coorg = await prisma.district.upsert({
        where: { id: 'coorg-dist' },
        update: {},
        create: { id: 'coorg-dist', name: 'Coorg', stateId: karnataka.id }
    })
    const chitradurga = await prisma.district.upsert({
        where: { id: 'chitradurga-dist' },
        update: {},
        create: { id: 'chitradurga-dist', name: 'Chitradurga', stateId: karnataka.id }
    })
    const mysore = await prisma.district.upsert({
        where: { id: 'mysore-dist' },
        update: {},
        create: { id: 'mysore-dist', name: 'Mysore', stateId: karnataka.id }
    })
    const kannur = await prisma.district.upsert({
        where: { id: 'kannur-dist' },
        update: {},
        create: { id: 'kannur-dist', name: 'Kannur', stateId: kerala.id }
    })
    const chandigarh = await prisma.district.upsert({
        where: { id: 'chandigarh-dist' },
        update: {},
        create: { id: 'chandigarh-dist', name: 'Chandigarh', stateId: haryana.id }
    })
    const noida = await prisma.district.upsert({
        where: { id: 'noida-dist' },
        update: {},
        create: { id: 'noida-dist', name: 'Noida', stateId: up.id }
    })

    // ============================================
    // ASSEMBLY & PARLIAMENTARY CONSTITUENCIES (For Prayagraj District)
    // ============================================
    console.log('🗳️ Creating constituencies...')

    // Parliamentary Constituencies for UP
    const prayagrajPC = await prisma.parliamentaryConstituency.upsert({
        where: { id: 'pc-prayagraj' },
        update: {},
        create: {
            id: 'pc-prayagraj',
            name: 'Prayagraj',
            constituencyNumber: 68,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 1850000,
            area: 'Prayagraj Urban and Suburban areas',
            description: 'Parliamentary constituency covering Prayagraj city and surrounding areas'
        }
    })

    const phulpurPC = await prisma.parliamentaryConstituency.upsert({
        where: { id: 'pc-phulpur' },
        update: {},
        create: {
            id: 'pc-phulpur',
            name: 'Phulpur',
            constituencyNumber: 69,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 1720000,
            area: 'Phulpur tehsil and surrounding areas',
            description: 'Parliamentary constituency in northern Prayagraj district'
        }
    })

    const lucknowPC = await prisma.parliamentaryConstituency.upsert({
        where: { id: 'pc-lucknow' },
        update: {},
        create: {
            id: 'pc-lucknow',
            name: 'Lucknow',
            constituencyNumber: 52,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 2150000,
            area: 'Lucknow city and metropolitan area',
            description: 'State capital parliamentary constituency'
        }
    })

    const varanasiPC = await prisma.parliamentaryConstituency.upsert({
        where: { id: 'pc-varanasi' },
        update: {},
        create: {
            id: 'pc-varanasi',
            name: 'Varanasi',
            constituencyNumber: 74,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 1950000,
            area: 'Varanasi city and surrounding areas',
            description: 'Ancient holy city parliamentary constituency'
        }
    })

    // Assembly Constituencies for Prayagraj
    const prayagrajNorthAC = await prisma.assemblyConstituency.upsert({
        where: { id: 'ac-prayagraj-north' },
        update: {},
        create: {
            id: 'ac-prayagraj-north',
            name: 'Prayagraj North',
            constituencyNumber: 396,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 320000,
            area: 'Civil Lines, Lukerganj, Ashok Nagar',
            description: 'Northern urban assembly segment of Prayagraj'
        }
    })

    const prayagrajSouthAC = await prisma.assemblyConstituency.upsert({
        where: { id: 'ac-prayagraj-south' },
        update: {},
        create: {
            id: 'ac-prayagraj-south',
            name: 'Prayagraj South',
            constituencyNumber: 397,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 295000,
            area: 'Katra, Chowk, Old City areas',
            description: 'Southern urban assembly segment of Prayagraj'
        }
    })

    const prayagrajWestAC = await prisma.assemblyConstituency.upsert({
        where: { id: 'ac-prayagraj-west' },
        update: {},
        create: {
            id: 'ac-prayagraj-west',
            name: 'Prayagraj West',
            constituencyNumber: 398,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 310000,
            area: 'Naini, Jhunsi, Phaphamau',
            description: 'Western assembly segment including trans-Ganga areas'
        }
    })

    const soraonAC = await prisma.assemblyConstituency.upsert({
        where: { id: 'ac-soraon' },
        update: {},
        create: {
            id: 'ac-soraon',
            name: 'Soraon',
            constituencyNumber: 393,
            stateId: up.id,
            reservationStatus: ReservationStatus.SC,
            totalVoters: 285000,
            area: 'Soraon tehsil, rural areas',
            description: 'Reserved SC assembly segment'
        }
    })

    const phulpurAC = await prisma.assemblyConstituency.upsert({
        where: { id: 'ac-phulpur' },
        update: {},
        create: {
            id: 'ac-phulpur',
            name: 'Phulpur',
            constituencyNumber: 394,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 275000,
            area: 'Phulpur tehsil',
            description: 'Rural assembly segment in Phulpur parliamentary constituency'
        }
    })

    // Lucknow Assembly Constituencies
    const lucknowCentralAC = await prisma.assemblyConstituency.upsert({
        where: { id: 'ac-lucknow-central' },
        update: {},
        create: {
            id: 'ac-lucknow-central',
            name: 'Lucknow Central',
            constituencyNumber: 180,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 340000,
            area: 'Hazratganj, Aminabad, Charbagh',
            description: 'Central business district of state capital'
        }
    })

    const lucknowEastAC = await prisma.assemblyConstituency.upsert({
        where: { id: 'ac-lucknow-east' },
        update: {},
        create: {
            id: 'ac-lucknow-east',
            name: 'Lucknow East',
            constituencyNumber: 181,
            stateId: up.id,
            reservationStatus: ReservationStatus.GENERAL,
            totalVoters: 355000,
            area: 'Gomti Nagar, Indira Nagar',
            description: 'Eastern developed areas of Lucknow'
        }
    })

    // Create Cities
    console.log('📍 Creating cities...')
    const prayagrajCity = await prisma.city.upsert({
        where: { id: 'prayagraj-city' },
        update: {},
        create: {
            id: 'prayagraj-city',
            name: 'Prayagraj City',
            districtId: prayagraj.id,
            pincode: '211001'
        }
    })
    const naini = await prisma.city.upsert({
        where: { id: 'naini-city' },
        update: {},
        create: {
            id: 'naini-city',
            name: 'Naini',
            districtId: prayagraj.id,
            pincode: '211008'
        }
    })

    // Add cities for other districts
    await prisma.city.upsert({
        where: { id: 'mumbai-city' },
        update: {},
        create: { id: 'mumbai-city', name: 'Mumbai City', districtId: mumbai.id, pincode: '400001' }
    })
    await prisma.city.upsert({
        where: { id: 'surat-city' },
        update: {},
        create: { id: 'surat-city', name: 'Surat City', districtId: surat.id, pincode: '395003' }
    })
    await prisma.city.upsert({
        where: { id: 'jaipur-city' },
        update: {},
        create: { id: 'jaipur-city', name: 'Jaipur City', districtId: jaipur.id, pincode: '302001' }
    })
    await prisma.city.upsert({
        where: { id: 'chennai-city' },
        update: {},
        create: { id: 'chennai-city', name: 'Chennai City', districtId: chennai.id, pincode: '600001' }
    })
    await prisma.city.upsert({
        where: { id: 'hyderabad-city' },
        update: {},
        create: { id: 'hyderabad-city', name: 'Hyderabad City', districtId: hyderabad.id, pincode: '500001' }
    })
    await prisma.city.upsert({
        where: { id: 'bangalore-city' },
        update: {},
        create: { id: 'bangalore-city', name: 'Bangalore City', districtId: bangalore.id, pincode: '560001' }
    })
    await prisma.city.upsert({
        where: { id: 'udaipur-city' },
        update: {},
        create: { id: 'udaipur-city', name: 'Udaipur City', districtId: udaipur.id, pincode: '313001' }
    })
    await prisma.city.upsert({
        where: { id: 'kanpur-city' },
        update: {},
        create: { id: 'kanpur-city', name: 'Kanpur City', districtId: kanpur.id, pincode: '208001' }
    })
    await prisma.city.upsert({
        where: { id: 'nagpur-city' },
        update: {},
        create: { id: 'nagpur-city', name: 'Nagpur City', districtId: nagpur.id, pincode: '440001' }
    })
    await prisma.city.upsert({
        where: { id: 'pune-city' },
        update: {},
        create: { id: 'pune-city', name: 'Pune City', districtId: pune.id, pincode: '411001' }
    })
    await prisma.city.upsert({
        where: { id: 'gorakhpur-city' },
        update: {},
        create: { id: 'gorakhpur-city', name: 'Gorakhpur City', districtId: gorakhpur.id, pincode: '273001' }
    })
    await prisma.city.upsert({
        where: { id: 'azamgarh-city' },
        update: {},
        create: { id: 'azamgarh-city', name: 'Azamgarh City', districtId: azamgarh.id, pincode: '276001' }
    })
    await prisma.city.upsert({
        where: { id: 'nashik-city' },
        update: {},
        create: { id: 'nashik-city', name: 'Nashik City', districtId: nashik.id, pincode: '422001' }
    })
    await prisma.city.upsert({
        where: { id: 'kolkata-city' },
        update: {},
        create: { id: 'kolkata-city', name: 'Kolkata City', districtId: kolkata.id, pincode: '700001' }
    })
    await prisma.city.upsert({
        where: { id: 'siliguri-city' },
        update: {},
        create: { id: 'siliguri-city', name: 'Siliguri City', districtId: siliguri.id, pincode: '734001' }
    })
    await prisma.city.upsert({
        where: { id: 'coorg-city' },
        update: {},
        create: { id: 'coorg-city', name: 'Coorg City', districtId: coorg.id, pincode: '571201' }
    })
    await prisma.city.upsert({
        where: { id: 'chitradurga-city' },
        update: {},
        create: { id: 'chitradurga-city', name: 'Chitradurga City', districtId: chitradurga.id, pincode: '577501' }
    })
    await prisma.city.upsert({
        where: { id: 'mysore-city' },
        update: {},
        create: { id: 'mysore-city', name: 'Mysore City', districtId: mysore.id, pincode: '570001' }
    })
    await prisma.city.upsert({
        where: { id: 'kannur-city' },
        update: {},
        create: { id: 'kannur-city', name: 'Kannur City', districtId: kannur.id, pincode: '670001' }
    })
    await prisma.city.upsert({
        where: { id: 'chandigarh-city' },
        update: {},
        create: { id: 'chandigarh-city', name: 'Chandigarh City', districtId: chandigarh.id, pincode: '160017' }
    })
    await prisma.city.upsert({
        where: { id: 'noida-city' },
        update: {},
        create: { id: 'noida-city', name: 'Noida City', districtId: noida.id, pincode: '201301' }
    })
    const lucknowCity = await prisma.city.upsert({
        where: { id: 'lucknow-city' },
        update: {},
        create: { id: 'lucknow-city', name: 'Lucknow City', districtId: lucknow.id, pincode: '226001' }
    })
    const varanasiCity = await prisma.city.upsert({
        where: { id: 'varanasi-city' },
        update: {},
        create: { id: 'varanasi-city', name: 'Varanasi City', districtId: varanasi.id, pincode: '221001' }
    })

    // Create Wards with Constituency Mapping
    console.log('📍 Creating wards with constituency mapping...')
    const wards = []

    // Wards 1-7: Prayagraj North Assembly, Prayagraj Parliamentary
    for (let i = 1; i <= 7; i++) {
        const ward = await prisma.ward.upsert({
            where: { id: `ward-${i}` },
            update: {
                assemblyConstituencyId: prayagrajNorthAC.id,
                parliamentaryConstituencyId: prayagrajPC.id
            },
            create: {
                id: `ward-${i}`,
                number: i,
                name: `Ward ${i} - Civil Lines`,
                cityId: prayagrajCity.id,
                assemblyConstituencyId: prayagrajNorthAC.id,
                parliamentaryConstituencyId: prayagrajPC.id
            }
        })
        wards.push(ward)
    }

    // Wards 8-14: Prayagraj South Assembly, Prayagraj Parliamentary
    for (let i = 8; i <= 14; i++) {
        const ward = await prisma.ward.upsert({
            where: { id: `ward-${i}` },
            update: {
                assemblyConstituencyId: prayagrajSouthAC.id,
                parliamentaryConstituencyId: prayagrajPC.id
            },
            create: {
                id: `ward-${i}`,
                number: i,
                name: `Ward ${i} - Old City`,
                cityId: prayagrajCity.id,
                assemblyConstituencyId: prayagrajSouthAC.id,
                parliamentaryConstituencyId: prayagrajPC.id
            }
        })
        wards.push(ward)
    }

    // Wards 15-20: Prayagraj West Assembly, Prayagraj Parliamentary
    for (let i = 15; i <= 20; i++) {
        const ward = await prisma.ward.upsert({
            where: { id: `ward-${i}` },
            update: {
                assemblyConstituencyId: prayagrajWestAC.id,
                parliamentaryConstituencyId: prayagrajPC.id
            },
            create: {
                id: `ward-${i}`,
                number: i,
                name: `Ward ${i} - Trans Ganga`,
                cityId: prayagrajCity.id,
                assemblyConstituencyId: prayagrajWestAC.id,
                parliamentaryConstituencyId: prayagrajPC.id
            }
        })
        wards.push(ward)
    }

    // ============================================
    // POLITICIANS
    // ============================================
    console.log('👔 Creating politicians...')

    // MLA for Prayagraj North
    await prisma.politician.upsert({
        where: { id: 'pol-prayagraj-north-mla' },
        update: {},
        create: {
            id: 'pol-prayagraj-north-mla',
            name: 'Harshvardhan Bajpai',
            gender: Gender.MALE,
            education: 'B.A., LL.B.',
            occupation: 'Social Worker',
            partyId: bjp.id,
            seatType: SeatType.MLA,
            assemblyConstituencyId: prayagrajNorthAC.id,
            termStartDate: new Date('2022-03-10'),
            isCurrentlyServing: true,
            biography: 'Serving as MLA for Prayagraj North since 2022, focusing on urban development and infrastructure.'
        }
    })

    // MLA for Prayagraj South
    await prisma.politician.upsert({
        where: { id: 'pol-prayagraj-south-mla' },
        update: {},
        create: {
            id: 'pol-prayagraj-south-mla',
            name: 'Nand Gopal Gupta Nandi',
            gender: Gender.MALE,
            education: 'M.A., Ph.D.',
            occupation: 'Politician, Former Minister',
            partyId: bjp.id,
            seatType: SeatType.MLA,
            assemblyConstituencyId: prayagrajSouthAC.id,
            termStartDate: new Date('2022-03-10'),
            isCurrentlyServing: true,
            biography: 'Senior politician and former cabinet minister, representing Prayagraj South.'
        }
    })

    // MLA for Prayagraj West
    await prisma.politician.upsert({
        where: { id: 'pol-prayagraj-west-mla' },
        update: {},
        create: {
            id: 'pol-prayagraj-west-mla',
            name: 'Sidharth Nath Singh',
            gender: Gender.MALE,
            education: 'M.B.A.',
            occupation: 'Politician',
            partyId: bjp.id,
            seatType: SeatType.MLA,
            assemblyConstituencyId: prayagrajWestAC.id,
            termStartDate: new Date('2022-03-10'),
            isCurrentlyServing: true,
            biography: 'Cabinet minister and MLA for Prayagraj West, focusing on industrial development.'
        }
    })

    // MLA for Soraon (SC Reserved)
    await prisma.politician.upsert({
        where: { id: 'pol-soraon-mla' },
        update: {},
        create: {
            id: 'pol-soraon-mla',
            name: 'Tribhuvan Ram',
            gender: Gender.MALE,
            education: 'B.A.',
            occupation: 'Social Worker',
            partyId: sp.id,
            seatType: SeatType.MLA,
            assemblyConstituencyId: soraonAC.id,
            termStartDate: new Date('2022-03-10'),
            isCurrentlyServing: true,
            biography: 'MLA for Soraon, working on rural development and social welfare.'
        }
    })

    // MLA for Phulpur
    await prisma.politician.upsert({
        where: { id: 'pol-phulpur-mla' },
        update: {},
        create: {
            id: 'pol-phulpur-mla',
            name: 'Praveen Kumar Patel',
            gender: Gender.MALE,
            education: 'Graduate',
            occupation: 'Farmer, Politician',
            partyId: sp.id,
            seatType: SeatType.MLA,
            assemblyConstituencyId: phulpurAC.id,
            termStartDate: new Date('2022-03-10'),
            isCurrentlyServing: true,
            biography: 'MLA for Phulpur assembly segment, advocating for agricultural reforms.'
        }
    })

    // MP for Prayagraj
    await prisma.politician.upsert({
        where: { id: 'pol-prayagraj-mp' },
        update: {},
        create: {
            id: 'pol-prayagraj-mp',
            name: 'Keshari Devi Patel',
            gender: Gender.FEMALE,
            education: 'B.A.',
            occupation: 'Politician',
            partyId: bjp.id,
            seatType: SeatType.MP,
            parliamentaryConstituencyId: prayagrajPC.id,
            termStartDate: new Date('2024-06-04'),
            isCurrentlyServing: true,
            biography: 'Member of Parliament for Prayagraj, first-time MP focusing on development initiatives.'
        }
    })

    // MP for Phulpur
    await prisma.politician.upsert({
        where: { id: 'pol-phulpur-mp' },
        update: {},
        create: {
            id: 'pol-phulpur-mp',
            name: 'Praveen Patel',
            gender: Gender.MALE,
            education: 'Post Graduate',
            occupation: 'Politician',
            partyId: sp.id,
            seatType: SeatType.MP,
            parliamentaryConstituencyId: phulpurPC.id,
            termStartDate: new Date('2024-06-04'),
            isCurrentlyServing: true,
            biography: 'MP for Phulpur, historic constituency of Jawaharlal Nehru.'
        }
    })

    // MP for Lucknow
    await prisma.politician.upsert({
        where: { id: 'pol-lucknow-mp' },
        update: {},
        create: {
            id: 'pol-lucknow-mp',
            name: 'Rajnath Singh',
            gender: Gender.MALE,
            education: 'M.A. (Physics)',
            occupation: 'Politician, Defense Minister',
            partyId: bjp.id,
            seatType: SeatType.MP,
            parliamentaryConstituencyId: lucknowPC.id,
            termStartDate: new Date('2024-06-04'),
            isCurrentlyServing: true,
            biography: 'Senior BJP leader, Defense Minister, and seven-time MP from Lucknow.'
        }
    })

    // MP for Varanasi
    await prisma.politician.upsert({
        where: { id: 'pol-varanasi-mp' },
        update: {},
        create: {
            id: 'pol-varanasi-mp',
            name: 'Narendra Modi',
            gender: Gender.MALE,
            education: 'M.A. (Political Science)',
            occupation: 'Prime Minister of India',
            partyId: bjp.id,
            seatType: SeatType.MP,
            parliamentaryConstituencyId: varanasiPC.id,
            termStartDate: new Date('2024-06-04'),
            isCurrentlyServing: true,
            biography: 'Prime Minister of India since 2014, representing Varanasi constituency.'
        }
    })

    // Create Departments
    console.log('🏢 Creating departments...')
    const departments = [
        { name: 'Health & Hospitals', slug: 'health-hospitals', description: 'Healthcare services and government hospitals', icon: '🏥', color: '#ef4444' },
        { name: 'Roadways & Transport', slug: 'roadways-transport', description: 'Roads, highways, and public transport', icon: '🚗', color: '#f97316' },
        { name: 'Water Supply & Drainage', slug: 'water-supply', description: 'Water distribution and sewage management', icon: '💧', color: '#3b82f6' },
        { name: 'Electricity', slug: 'electricity', description: 'Power supply and electrical infrastructure', icon: '⚡', color: '#eab308' },
        { name: 'Food & Public Distribution', slug: 'food-distribution', description: 'Ration shops and food subsidy', icon: '🌾', color: '#84cc16' },
        { name: 'Education', slug: 'education', description: 'Government schools and educational institutions', icon: '🎓', color: '#8b5cf6' },
        { name: 'Police & Safety', slug: 'police-safety', description: 'Law enforcement and public safety', icon: '🛡️', color: '#6366f1' },
        { name: 'Municipal Services', slug: 'municipal-services', description: 'Garbage collection, street cleaning, civic amenities', icon: '🏛️', color: '#14b8a6' },
        { name: 'Corruption & Vigilance', slug: 'corruption-vigilance', description: 'Anti-corruption and vigilance complaints', icon: '👁️', color: '#dc2626' }
    ]

    const createdDepts: Record<string, { id: string; name: string }> = {}
    for (const dept of departments) {
        const created = await prisma.department.upsert({
            where: { slug: dept.slug },
            update: {},
            create: dept
        })
        createdDepts[dept.slug] = created
    }

    // Create Users
    console.log('👤 Creating users...')
    const hashedPassword = await hash('demo123', 12)

    // Admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            email: 'admin@demo.com',
            name: 'System Admin',
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date()
        }
    })

    // Citizen users
    const citizenUser = await prisma.user.upsert({
        where: { email: 'citizen@demo.com' },
        update: {},
        create: {
            email: 'citizen@demo.com',
            name: 'Rahul Sharma',
            password: hashedPassword,
            role: 'CITIZEN',
            phone: '+91 98765 43210',
            emailVerified: new Date()
        }
    })

    // Authority users
    const authorityUser1 = await prisma.user.upsert({
        where: { email: 'authority@demo.com' },
        update: {},
        create: {
            email: 'authority@demo.com',
            name: 'Rajesh Kumar',
            password: hashedPassword,
            role: 'AUTHORITY',
            emailVerified: new Date()
        }
    })

    const authorityUser2 = await prisma.user.upsert({
        where: { email: 'authority2@demo.com' },
        update: {},
        create: {
            email: 'authority2@demo.com',
            name: 'Priya Singh',
            password: hashedPassword,
            role: 'AUTHORITY',
            emailVerified: new Date()
        }
    })

    // Create Authority Profiles
    console.log('👮 Creating authority profiles...')
    const authority1 = await prisma.authority.upsert({
        where: { userId: authorityUser1.id },
        update: {},
        create: {
            userId: authorityUser1.id,
            departmentId: createdDepts['roadways-transport'].id,
            designation: 'Junior Engineer',
            level: 1,
            wardId: wards[0].id,
            cityId: prayagrajCity.id,
            districtId: prayagraj.id
        }
    })

    const authority2 = await prisma.authority.upsert({
        where: { userId: authorityUser2.id },
        update: {},
        create: {
            userId: authorityUser2.id,
            departmentId: createdDepts['water-supply'].id,
            designation: 'Executive Engineer',
            level: 2,
            cityId: prayagrajCity.id,
            districtId: prayagraj.id
        }
    })

    // Create Escalation Rules
    console.log('⏫ Creating escalation rules...')
    for (const slug of ['roadways-transport', 'water-supply', 'electricity', 'municipal-services']) {
        await prisma.escalationRule.upsert({
            where: {
                id: `${slug}-rule-1`
            },
            update: {},
            create: {
                id: `${slug}-rule-1`,
                departmentId: createdDepts[slug].id,
                fromLevel: 1,
                toLevel: 2,
                daysToEscalate: 7
            }
        })
        await prisma.escalationRule.upsert({
            where: {
                id: `${slug}-rule-2`
            },
            update: {},
            create: {
                id: `${slug}-rule-2`,
                departmentId: createdDepts[slug].id,
                fromLevel: 2,
                toLevel: 3,
                daysToEscalate: 5
            }
        })
    }

    // Create Sample Complaints with Constituency Mapping
    console.log('📝 Creating sample complaints with constituency mapping...')
    const complaints = [
        {
            ticketNumber: 'GRV-M9X8Y7-DEMO',
            title: 'Pothole on Main Road near Market',
            description: 'There is a large pothole on Main Road near the vegetable market that has been causing accidents. Several two-wheelers have skidded due to this. The pothole is approximately 2 feet wide and 8 inches deep.',
            status: ComplaintStatus.IN_PROGRESS,
            priority: Priority.HIGH,
            departmentId: createdDepts['roadways-transport'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[0].id,
            address: 'Near Vegetable Market, Main Road, Civil Lines',
            pincode: '211001',
            assignedAuthorityId: authority1.id,
            currentEscalationLevel: 1,
            assemblyConstituencyId: prayagrajNorthAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        },
        {
            ticketNumber: 'GRV-K7L8M9-DEMO',
            title: 'Water supply disruption in Ward 7',
            description: 'Water supply has been disrupted for the past 3 days in Ward 7. Many families are affected and have to walk long distances to fetch water.',
            status: ComplaintStatus.SUBMITTED,
            priority: Priority.URGENT,
            departmentId: createdDepts['water-supply'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[6].id,
            address: 'Ward 7, Near Temple',
            pincode: '211001',
            assignedAuthorityId: authority2.id,
            currentEscalationLevel: 1,
            assemblyConstituencyId: prayagrajNorthAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        },
        {
            ticketNumber: 'GRV-P2Q3R4-DEMO',
            title: 'Streetlight not working on MG Road',
            description: 'Multiple streetlights on MG Road have not been working for over a week. This creates safety concerns at night.',
            status: ComplaintStatus.RESOLVED,
            priority: Priority.MEDIUM,
            departmentId: createdDepts['electricity'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[2].id,
            address: 'MG Road, Near Bus Stand',
            pincode: '211001',
            resolvedAt: new Date(),
            assemblyConstituencyId: prayagrajNorthAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        },
        {
            ticketNumber: 'GRV-S5T6U7-DEMO',
            title: 'Garbage not collected for a week',
            description: 'Garbage has not been collected from our street for over a week now. The accumulated waste is creating hygiene issues.',
            status: ComplaintStatus.ESCALATED,
            priority: Priority.HIGH,
            departmentId: createdDepts['municipal-services'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[19].id,
            address: 'Street no. 5, Katra',
            pincode: '211002',
            currentEscalationLevel: 2,
            assemblyConstituencyId: prayagrajWestAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        },
        {
            ticketNumber: 'GRV-A1B2C3-DEMO',
            title: 'Broken water pipeline causing flooding',
            description: 'A major water pipeline has burst near Chowk area causing water wastage and road flooding for the past 2 days.',
            status: ComplaintStatus.IN_PROGRESS,
            priority: Priority.URGENT,
            departmentId: createdDepts['water-supply'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[9].id,
            address: 'Near Chowk, Old City',
            pincode: '211003',
            assignedAuthorityId: authority2.id,
            currentEscalationLevel: 1,
            assemblyConstituencyId: prayagrajSouthAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        },
        {
            ticketNumber: 'GRV-D4E5F6-DEMO',
            title: 'School building needs repair',
            description: 'Government primary school building roof is leaking. Students are facing difficulty during rainy season.',
            status: ComplaintStatus.RESOLVED,
            priority: Priority.MEDIUM,
            departmentId: createdDepts['education'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[11].id,
            address: 'Government Primary School, Ward 12',
            pincode: '211003',
            resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            assemblyConstituencyId: prayagrajSouthAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        },
        {
            ticketNumber: 'GRV-G7H8I9-DEMO',
            title: 'Frequent power cuts in residential area',
            description: 'Experiencing power cuts 4-5 times daily, each lasting 2-3 hours. Affecting work from home and students studying online.',
            status: ComplaintStatus.CLOSED,
            priority: Priority.HIGH,
            departmentId: createdDepts['electricity'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[16].id,
            address: 'Naini Industrial Area',
            pincode: '211008',
            resolvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            closedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            assemblyConstituencyId: prayagrajWestAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        },
        {
            ticketNumber: 'GRV-J1K2L3-DEMO',
            title: 'Damaged road near hospital entrance',
            description: 'The road leading to district hospital is severely damaged. Ambulances are facing difficulty in emergency situations.',
            status: ComplaintStatus.RESOLVED,
            priority: Priority.URGENT,
            departmentId: createdDepts['roadways-transport'].id,
            citizenId: citizenUser.id,
            cityId: prayagrajCity.id,
            wardId: wards[4].id,
            address: 'District Hospital Road',
            pincode: '211001',
            resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            assemblyConstituencyId: prayagrajNorthAC.id,
            parliamentaryConstituencyId: prayagrajPC.id
        }
    ]

    for (const complaint of complaints) {
        await prisma.complaint.upsert({
            where: { ticketNumber: complaint.ticketNumber },
            update: {},
            create: complaint
        })
    }

    // Create status logs for complaints
    console.log('📜 Creating status logs...')
    const demoComplaint = await prisma.complaint.findUnique({
        where: { ticketNumber: 'GRV-M9X8Y7-DEMO' }
    })

    if (demoComplaint) {
        await prisma.complaintStatusLog.createMany({
            data: [
                {
                    complaintId: demoComplaint.id,
                    status: ComplaintStatus.SUBMITTED,
                    notes: 'Complaint registered successfully',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                    complaintId: demoComplaint.id,
                    status: ComplaintStatus.VIEWED,
                    notes: 'Complaint reviewed and forwarded to field team',
                    authorityId: authority1.id,
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
                },
                {
                    complaintId: demoComplaint.id,
                    status: ComplaintStatus.IN_PROGRESS,
                    notes: 'Field inspection completed. Work order issued for pothole repair.',
                    authorityId: authority1.id,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            ],
            skipDuplicates: true
        })
    }

    console.log('✅ Database seeding completed!')
    console.log('\n📧 Demo Credentials:')
    console.log('   Citizen: citizen@demo.com / demo123')
    console.log('   Authority: authority@demo.com / demo123')
    console.log('   Admin: admin@demo.com / demo123')
    console.log('\n🗳️ Political Data Seeded:')
    console.log('   Parties: 6 major parties')
    console.log('   Parliamentary Constituencies: 4 (Prayagraj, Phulpur, Lucknow, Varanasi)')
    console.log('   Assembly Constituencies: 7 (5 in Prayagraj, 2 in Lucknow)')
    console.log('   Politicians: 9 (5 MLAs, 4 MPs)')
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
