import { Test } from "@nestjs/testing";
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { config } from "rxjs";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs'

const mockCredentialsDto = { username: 'TestUsername', password: "Testpassword"};

describe('Userrepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ 
                UserRepository,
            ],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('singUp', () =>{
        let save;
        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        })

        it('successfully signs up the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
        });

        // it('throws a conflic exception as username already exist', () => {
        //     save.mockResolvedValue({ code: '23505' });
        //     expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        // });
        
        // it('throws a conflic exception as username already exist', () => {
        //     save.mockRejectedValue({ code: '123123'}); //unhandled error code
        //     expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        // });
    });

    describe('validateUserPassword',() => {
        let user;
        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = "TestUsername";
            user.validatePassword = jest.fn();
        });

        it('return the username as validation is successful', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validateuserPassword(mockCredentialsDto);
            expect(result).toEqual('TestUsername')

        });

        it('return null as user cannot be found',  async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateuserPassword(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
        it('return null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validateuserPassword(mockCredentialsDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('hashPassword',() =>{
        it('calls bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');
        });
    })
})