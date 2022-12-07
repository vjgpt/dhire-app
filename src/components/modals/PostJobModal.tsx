import { IJobs } from '@/interfaces/store/data/job.interface';
import { skill } from '@/interfaces/response.interface';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Stack,
  Radio,
  RadioGroup,
  HStack,
  CheckboxGroup,
  Checkbox,
  useToast,
  chakra,
  Select,
  InputRightAddon,
  Tooltip,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  UnorderedList,
  ListItem,
  ListIcon,
  List,
} from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useJobStore } from 'src/app/store/job/jobStore';
import { useProfileStore } from 'src/app/store/profile/profileStore';
import { JobLevel, JobType, SkillLevel, SalaryType } from 'src/lib/enums/enums';
import { EditableList } from 'src/lib/helpers/EditableInput/EditableList';
import { MdCheckCircle } from 'react-icons/md';

const PostJobModal = ({ isOpen, onOpen, onClose }: any) => {
  const [jobType, setJobType] = useState<JobType[]>();
  const [benefits, setBenefits] = useState<string[]>();
  const [jobDesc, setJobDesc] = useState<string[]>();
  const [allSkills, setAllSkills] = useState<skill[]>([]);
  const [skill, setSkill] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.BEGINNER);
  const { job, createJob } = useJobStore();
  const { recruiterProfile, company, user } = useProfileStore();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({});

  const submit = async (data: any) => {
    let error = '',
      status = 'error';
    if (jobType?.length === 0) {
      error = 'Please select some job type.';
    } else if (data.to <= data.from) {
      error = 'Job duration is incorrect.';
    } else if (data.minSalary > data.maxSalary) {
      error = 'Salary range is incorrect.';
    } else if (allSkills.length === 0) {
      error = 'Please add some relevant skills';
    } else if (benefits?.length === 0) {
      console.log(benefits);
      error = 'Please add benefits';
    } else {
      const newJob: IJobs = {
        ...data,
        description: jobDesc,
        from: new Date(data.from),
        to: new Date(data.to),
        minSalary: parseInt(data.minSalary),
        maxSalary: parseInt(data.maxSalary),
        jobType,
        skills: allSkills,
        userId: user.id,
        benefits,
        companyId: company.id,
        recruiterProfileUserId: recruiterProfile.userId,
      };
      console.log(newJob);
      const result = await createJob(newJob);
      if (!result.message.includes('error')) {
        error = 'Successfully created new job.';
        status = 'success';
      }
      reset();
      setAllSkills([]);
      setJobType([]);
      setSkill('');
      onClose();
    }
    toast({
      position: 'top',
      title: status === 'error' ? 'ERROR !!' : 'Success !',
      description: error,
      status: status === 'error' ? 'error' : 'success',
      duration: 3000,
      isClosable: true,
      containerStyle: {
        marginTop: '10%',
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        p="1rem"
        pb="2rem"
        zIndex={100}
        w={{ base: '90vw', sm: '80vw' }}
        mt={{ base: '10px', sm: '40px', xl: '5%' }}
        maxWidth="100vw"
      >
        <ModalHeader
          fontWeight={'600'}
          fontSize={{ base: '2rem', lg: '2.2rem', xl: '2.5rem' }}
        >
          Job Details
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(submit)}>
          <ModalBody
            display="flex"
            fontSize={['10px !important']}
            flexDirection={'row'}
            gap="1rem"
            pb={6}
            flexWrap="wrap"
            justifyContent={'space-between'}
          >
            {/* Job Title */}
            <FormControl
              minW={'250px'}
              isRequired
              w={{ base: '100%', md: '45%' }}
            >
              <FormLabel htmlFor="title">Job Title</FormLabel>
              <Input
                size={{ base: 'sm', lg: 'md' }}
                isRequired
                id="title"
                placeholder="Title"
                {...register('title', {
                  required: 'This is required',
                  minLength: {
                    value: 4,
                    message: 'Minimum length should be 4',
                  },
                  pattern: {
                    value: /^[^\s]+(?:$|.*[^\s]+$)/,
                    message:
                      'Entered value cant start/end or contain only white spacing',
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name="title"
                render={({ message }) => (
                  <Text fontSize="sm" color="red.500" py="0.5rem">
                    {message}
                  </Text>
                )}
              />
            </FormControl>

            {/*location */}
            <FormControl
              minW={'250px'}
              isRequired
              w={{ base: '100%', md: '45%' }}
            >
              <FormLabel htmlFor="location">Location</FormLabel>
              <Input
                size={{ base: 'sm', lg: 'md' }}
                isRequired
                type="text"
                id="location"
                placeholder="Location"
                {...register('location', {
                  required: 'This is Required',
                  minLength: {
                    value: 4,
                    message: 'minimum number of character for location is 4',
                  },
                  pattern: {
                    value: /^[^\s]+(?:$|.*[^\s]+$)/,
                    message: 'Location can not contain only white spacing',
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name="location"
                render={({ message }) => (
                  <Text fontSize="sm" color="red.500" py="0.5rem">
                    {message}
                  </Text>
                )}
              />
            </FormControl>

            {/*Date from */}
            <FormControl
              minW={'250px'}
              isRequired
              w={{ base: '100%', md: '45%' }}
            >
              <FormLabel htmlFor="from">From</FormLabel>

              <Input
                size={{ base: 'sm', lg: 'md' }}
                isRequired
                type="date"
                id="from"
                {...register('from', {
                  required: 'This is Required',
                })}
              />
              <ErrorMessage
                errors={errors}
                name="from"
                render={({ message }) => (
                  <Text fontSize="sm" color="red.500" py="0.5rem">
                    {message}
                  </Text>
                )}
              />
            </FormControl>

            {/* SALARY */}
            <HStack
              w={{ base: '100%', md: '45%' }}
              justifyContent="space-between"
              flexWrap={'wrap'}
              spacing={0}
            >
              <FormControl minW={'160px'} isRequired w={'45%'}>
                <FormLabel htmlFor="minSalary">Min Salary</FormLabel>
                <InputGroup size={{ base: 'sm', lg: 'md' }}>
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                    isRequired
                    type="number"
                    id="minSalary"
                    {...register('minSalary', {
                      required: 'This is Required',
                    })}
                  />
                </InputGroup>
                <ErrorMessage
                  errors={errors}
                  name="minSalary"
                  render={({ message }) => (
                    <Text fontSize="sm" color="red.500" py="0.5rem">
                      {message}
                    </Text>
                  )}
                />
              </FormControl>
              <FormControl minW={'160px'} isRequired w={'45%'}>
                <FormLabel htmlFor="maxSalary">Max Salary</FormLabel>
                <InputGroup size={{ base: 'sm', lg: 'md' }}>
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                    isRequired
                    type="number"
                    id="maxSalary"
                    {...register('maxSalary', {
                      required: 'This is Required',
                    })}
                  />
                </InputGroup>
                <ErrorMessage
                  errors={errors}
                  name="maxSalary"
                  render={({ message }) => (
                    <Text fontSize="sm" color="red.500" py="0.5rem">
                      {message}
                    </Text>
                  )}
                />
              </FormControl>
            </HStack>

            {/* SALARY TYPE */}
            <FormControl minW={'280px'} isRequired w={'45%'}>
              <FormLabel htmlFor="salaryType">Salary Type</FormLabel>
              <RadioGroup
                defaultValue={SalaryType.CRYPTO}
                size={{ base: 'sm', lg: 'md' }}
              >
                <Stack spacing={5} direction="row" flexWrap={'wrap'}>
                  <Radio
                    colorScheme="green"
                    value={SalaryType.CRYPTO}
                    {...register('salaryType')}
                  >
                    Crypto
                  </Radio>
                  <Radio
                    colorScheme="green"
                    value={SalaryType.FIAT}
                    {...register('salaryType')}
                  >
                    Fiat
                  </Radio>
                </Stack>
              </RadioGroup>
              <ErrorMessage
                errors={errors}
                name="salaryType"
                render={({ message }) => (
                  <Text fontSize="sm" color="red.500" py="0.5rem">
                    {message}
                  </Text>
                )}
              />
            </FormControl>

            {/* JOB TYPE */}
            <FormControl minW={'280px'} w={{ base: '100%', md: '45%' }}>
              <FormLabel htmlFor="salaryType">Job Type</FormLabel>
              <CheckboxGroup
                size={{ base: 'sm', lg: 'md' }}
                colorScheme="green"
                onChange={(value) => setJobType(value as JobType[])}
              >
                <Stack
                  spacing={0}
                  direction={['column', 'row']}
                  flexWrap="wrap"
                >
                  <Checkbox value={JobType.FULLTIME} w="20%" minW="130px">
                    Full Time
                  </Checkbox>
                  <Checkbox value={JobType.PARTTIME} w="20%" minW="130px">
                    Part Time
                  </Checkbox>
                  <Checkbox value={JobType.FREELANCE} w="20%" minW="130px">
                    Freelance
                  </Checkbox>
                  <Checkbox value={JobType.REMOTE} w="20%" minW="130px">
                    Remote
                  </Checkbox>
                  <Checkbox value={JobType.INTERNSHIP} w="20%" minW="130px">
                    Internship
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>

            {/* JOB LEVEL */}
            <FormControl
              minW={'280px'}
              isRequired
              w={{ base: '100%', md: '45%' }}
            >
              <FormLabel htmlFor="jobLevel">Job Level</FormLabel>
              <RadioGroup
                defaultValue={JobLevel.BEGINNER}
                size={{ base: 'sm', lg: 'md' }}
              >
                <Stack spacing={0} direction="row" flexWrap={'wrap'}>
                  <Radio
                    colorScheme="green"
                    minW={'130px'}
                    w={'33%'}
                    value={JobLevel.BEGINNER}
                    {...register('jobLevel')}
                  >
                    Beginner
                  </Radio>
                  <Radio
                    colorScheme="green"
                    minW={'130px'}
                    w={'33%'}
                    value={JobLevel.INTERMEDIATE}
                    {...register('jobLevel')}
                  >
                    Intermediate
                  </Radio>
                  <Radio
                    colorScheme="green"
                    minW={'130px'}
                    w={'33%'}
                    value={JobLevel.ADVANCED}
                    {...register('jobLevel')}
                  >
                    Advanced
                  </Radio>
                </Stack>
              </RadioGroup>
              <ErrorMessage
                errors={errors}
                name="jobLevel"
                render={({ message }) => (
                  <Text fontSize="sm" color="red.500" py="0.5rem">
                    {message}
                  </Text>
                )}
              />
            </FormControl>
            {/* Benifits */}
            <FormControl minW={'280px'} w={{ base: '100%', md: '45%' }}>
              <FormLabel>
                Benefits{' '}
                <Box as="span" color="red">
                  *
                </Box>
              </FormLabel>
              <EditableList list={benefits || []} setList={setBenefits} />
              <Stack
                direction={'row'}
                w={'100%'}
                flexWrap="wrap"
                spacing={0}
                gap={1}
                alignContent={'flex-start'}
                flexGrow={1}
                p={1}
                borderRadius="10px"
              >
                {benefits?.map(
                  (item, index) =>
                    item && (
                      <Tag key={index} w="fit-content">
                        <TagLabel>{item}</TagLabel>
                        <TagCloseButton
                          onClick={() => {
                            let newArr = benefits.filter((b, i) => i !== index);
                            setBenefits(newArr);
                          }}
                        />
                      </Tag>
                    )
                )}
              </Stack>
            </FormControl>
            <Stack
              w={'full'}
              wrap={'wrap'}
              direction="row"
              justifyContent={'space-between'}
            >
              {/*Description*/}
              <FormControl minW={'280px'} w={{ base: '100%', md: '45%' }}>
                <FormLabel>
                  Job Description{' '}
                  <Box as="span" color="red">
                    *
                  </Box>
                </FormLabel>

                <EditableList list={jobDesc || []} setList={setJobDesc} />
                <UnorderedList
                  fontSize="1rem"
                  spacing={3}
                  listStylePos={'inside'}
                >
                  {jobDesc?.map((item, index) => (
                    <ListItem key={index} role="group" pl="10px">
                      <Tag w="90%" bg="white">
                        {item}
                        <TagCloseButton
                          ml="auto"
                          onClick={() => {
                            let newArr = jobDesc.filter((b, i) => i !== index);
                            setJobDesc(newArr);
                          }}
                        />
                      </Tag>
                    </ListItem>
                  ))}
                </UnorderedList>

                <ErrorMessage
                  errors={errors}
                  name="description"
                  render={({ message }) => (
                    <Text fontSize="sm" color="red.500" py="0.5rem">
                      {message}
                    </Text>
                  )}
                />
              </FormControl>

              {/* ADD SKILLS */}
              <FormControl minW={'280px'} w={{ base: '100%', md: '45%' }}>
                <FormLabel>
                  Skills Required{' '}
                  <Box as="span" color="red">
                    *
                  </Box>
                </FormLabel>

                <InputGroup size="sm" mb={3} display="flex">
                  <Select
                    size="sm"
                    w="fit-content"
                    value={skillLevel}
                    onChange={({ target }) => {
                      let level = target.value as SkillLevel;
                      setSkillLevel(level);
                    }}
                  >
                    <option value={SkillLevel.BEGINNER}>Beginner</option>
                    <option value={SkillLevel.INTERMEDIATE}>
                      Intermediate
                    </option>
                    <option value={SkillLevel.ADVANCED}>Advanced</option>
                  </Select>
                  <Input
                    w="100px"
                    size={'sm'}
                    flexGrow={1}
                    value={skill}
                    onKeyPress={(e) => {
                      if (e.charCode === 13) {
                        e.preventDefault();
                        if (skill && skillLevel) {
                          let newObj = { name: skill, level: skillLevel };
                          setAllSkills([...allSkills, newObj]);
                          setSkill('');
                          setSkillLevel(SkillLevel.BEGINNER);
                        }
                      }
                    }}
                    onChange={(e) => setSkill(e.target.value)}
                  />
                  <InputRightAddon
                    cursor={'pointer'}
                    _hover={{ bg: 'gray.200' }}
                    onClick={() => {
                      if (skill && skillLevel) {
                        let newObj = { name: skill, level: skillLevel };
                        setAllSkills([...allSkills, newObj]);
                        setSkill('');
                        setSkillLevel(SkillLevel.BEGINNER);
                      }
                    }}
                  >
                    +
                  </InputRightAddon>
                </InputGroup>

                <Stack
                  direction={'row'}
                  w={'100%'}
                  flexWrap="wrap"
                  spacing={0}
                  gap={1}
                  alignContent={'flex-start'}
                  flexGrow={1}
                  p={1}
                  borderRadius="10px"
                >
                  {allSkills?.map((skill, index) => (
                    <Tag key={index} w="fit-content">
                      <TagLabel>
                        {skill.level[0] + skill.level.toLowerCase().slice(1)}:{' '}
                        {skill.name}
                      </TagLabel>
                      <TagCloseButton
                        onClick={(e) => {
                          let newSkills = allSkills.filter(
                            (item) => item !== skill
                          );
                          setAllSkills(newSkills);
                        }}
                      />
                    </Tag>
                  ))}
                </Stack>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter p="0rem 1rem">
            <Button
              size={{ base: 'sm', md: 'md', lg: 'lg' }}
              fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="blue"
              mr={3}
            >
              Create Job
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PostJobModal;
