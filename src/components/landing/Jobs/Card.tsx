import {
  Box,
  Center,
  Container,
  Heading,
  Icon,
  Stack,
  Tag,
  Text,
  Image,
  useDimensions,
} from '@chakra-ui/react';
//import Image from 'next/image';
import React, { RefObject, useRef } from 'react';
import { RiMapPin2Line } from 'react-icons/ri';
import { IJob } from '@/interfaces/store/data/job.interface';

const Card: React.FC<IJob> = (props) => {
  const elementRef = useRef() as RefObject<HTMLElement>;
  const dimensions = useDimensions(elementRef);

  //console.log('card dimensions - ', dimensions?.contentBox.width);
  const {
    id,
    job_title,
    job_company,
    job_company_image,
    job_description,
    job_type,
    job_experience_level,
    job_salary_max,
    job_salary_min,
    job_location,
  } = props;

  const getJobType = (job_type: number) => {
    if (job_type === 1) {
      return 'Full time';
    } else if (job_type === 2) {
      return 'Part time';
    } else if (job_type === 3) {
      return 'Freelance';
    } else if (job_type === 4) {
      return 'Remote';
    } else {
      return 'Internship';
    }
  };
  const getExperienceType = (job_experience_level: number) => {
    if (job_experience_level === 1) {
      return 'Entry Level';
    } else if (job_experience_level === 2) {
      return 'Intermediate Level';
    } else if (job_experience_level === 3) {
      return 'Senior Level';
    }
  };
  return (
    <Container
      _hover={{
        transform: 'scale(1.015)',
        transition: 'all 0.2s ease-out',
      }}
      transition="all 0.2s ease-in"
      ref={elementRef as RefObject<HTMLDivElement>}
      my="1rem"
      maxW="4xl"
      bg="white"
      p={{ base: '1.2rem', md: '2.2rem' }}
      rounded="md"
      boxShadow="0px 35px 41px 10px rgba(0, 0, 0, 0.03)"
    >
      <Stack direction={'column'} gap={{ base: '10px', md: '0.8rem' }}>
        <Stack
          alignItems={'flex-start'}
          flexDirection={{ base: 'column', md: 'row' }}
          gap={{ md: '1rem' }}
        >
          <Stack
            w={'full'}
            alignItems={{ base: 'center', md: 'flex-start' }}
            flexDirection={'row'}
            fontSize={{ base: '10px', sm: '12px', md: 'md' }}
          >
            <Center
              m="0.5rem"
              minW="40px"
              minH="40px"
              w={{ base: 'full', md: 'full' }}
              h={{ base: '4rem', md: '4rem' }}
              maxW="4rem"
              position="relative"
            >
              <Image
                src={'https://xsgames.co/randomusers/avatar.php?g=female'}
                alt="Job Logo"
                rounded={'full'}
                //layout="fill"
                objectFit="contain"
              />
            </Center>
            <Stack mt="0" mr="auto" w="150%" direction={'column'} spacing={1}>
              <Heading
                noOfLines={1}
                lineHeight="140%"
                fontSize={['17px', '20px', '24px']}
              >
                {job_title}
              </Heading>
              <Stack
                justify="space-between"
                w="70%"
                direction="row"
                color="gray.400"
              >
                <Text>{job_company}</Text>
                <Stack direction="row" align={'center'}>
                  <Icon as={RiMapPin2Line} w={4} h={4} color="gray.400" />
                  <Text w="max-content">
                    {job_location ? job_location : 'Remote'}
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Center m="0" w="full">
            <Heading
              ml={{ base: 3, md: 'auto' }}
              mr={{ base: 'auto', md: 0 }}
              fontSize={['15px', '20px', '24px']}
            >
              ${job_salary_min}K - ${job_salary_max}K
            </Heading>
          </Center>
        </Stack>
        <Box>
          <Text
            noOfLines={[3, 3, 2]}
            textAlign={'start'}
            color="gray.500"
            fontWeight={'500'}
            fontSize={['12px', '15px', 'md']}
          >
            {job_description}
          </Text>
        </Box>
        <Box display={'flex'} gap="1rem">
          <Tag fontSize={['10px', '15px', 'lg']}>
            {getExperienceType(job_experience_level)}
          </Tag>
          <Tag fontSize={['10px', '15px', 'lg']}>{getJobType(job_type)}</Tag>
        </Box>
      </Stack>
    </Container>
  );
};

export default Card;
