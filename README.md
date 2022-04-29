# Server

Blote 서버
투명성, 익명성이 보장된 블록체인 투표 시스템

<br></br>

## Architecture

![Architecture](https://user-images.githubusercontent.com/35136024/165886515-f745f002-0b0a-4f4e-a5cd-b40fa3361d7e.png)

<br></br>

## RESTful API Document

-   [Response Example](#response-example)
-   [Auth, 인증](#auth-인증)

    -   [Send authentication email](#post---send-authentication-email)
    -   [Sign In](#post---sign-in)
    -   [Sign Up](#post---sign-out)
    -   [Sign Out](#post---sign-out)

-   [Vote, 투표](#vote-투표)

    -   [Vote](#post---vote)
    -   [Get Vote List](#post---get-vote-list)
    -   [Get Vote Overview](#post---get-vote-list)
    -   [Get My Vote In Progress](#post---get-my-vote-in-progress)
    -   [Get Past Vote Result](#post---get-past-vote-result)
    -   [Decode Vote Receipt](#post---decode-vote-receipt)
    -   [Add Vote](#post---add-vote)
    -   [Update Vote](#post---update-vote)
    -   [Add Candidate](#post---add-candidate)
    -   [Update Candidate](#post---update-candidate)

-   [Models](#models)

    -   [Vote Model](#vote-model)
    -   [Candidate Model](#candidate-model)

    <br></br>

# Response Example

### Default Response

```
{
    "data": {
        responseData
    }
}
```

### Error Response

```
{
    "error": Defined Error Message
}
```

<br></br>

# Auth, 인증

## POST - Send authentication email

```
~/auth/send-email
```

인증 코드가 포함된 인증 메일을 발송합니다.

### Parameters

| Key   | Type   | Description   |
| ----- | ------ | ------------- |
| email | String | 사용할 이메일 |

### Response

없음

<br></br>

## POST - Sign In

```
~/auth/sign-in
```

입력받은 이메일과 비밀번호로 로그인을 진행합니다.

### Parameters

| Key      | Type   | Description |
| -------- | ------ | ----------- |
| email    | String | 이메일      |
| password | String | 비밀번호    |

### Response

| Key         | Type   | Description |
| ----------- | ------ | ----------- |
| idx         | Number | 유저 고유값 |
| email       | String | 이메일      |
| name        | String | 고객 이름   |
| studentID   | Number | 학번        |
| major       | Number | 학과        |
| accessLevel | Number | 권한        |

<br></br>

## POST - Sign Up

```
~/auth/sign-up
```

입력받은 정보로 회원가입을 진행합니다.

### Parameters

| Key       | Type   | Description |
| --------- | ------ | ----------- |
| email     | String | 이메일      |
| password  | String | 비밀번호    |
| authCode  | Number | 인증코드    |
| name      | String | 고객 이름   |
| studentID | Number | 학번        |
| major     | Number | 학과        |

### Response

없음

<br></br>

## POST - Sign Out

```
~/auth/sign-out
```

로그인된 계정의 로그아웃을 진행합니다.

### Parameters

없음

### Response

없음

<br></br>

# Vote, 투표

## POST - Vote

```
~/vote/vote
```

투표 결과를 반영합니다. renounce가 `true`일 경우 기권표로 반영됩니다. 스마트 컨트랙트를 호출하여 블록체인에 기록합니다.

### Parameters

| Key      | Type    | Description   |
| -------- | ------- | ------------- |
| voteIdx  | Number  | 투표 고유값   |
| candIdx  | Number  | 후보자 고유값 |
| renounce | Boolean | 기권 여부     |

### Response

| Key     | Type   | Description      |
| ------- | ------ | ---------------- |
| receipt | String | 투표 결과 영수증 |

<br></br>

## POST - Get Vote List

```
~/vote/get-vote-list
```

현재 진행중인 투표 목록을 반환합니다.

### Parameters

없음

### Response

| Key  | Type                         | Description |
| ---- | ---------------------------- | ----------- |
| list | Array\<[Vote](#vote-model)\> | 투표 목록   |

<br></br>

## POST - Get Vote Overview

```
~/vote/get-vote-overview
```

특정 투표의 상세 내용을 반환합니다.

### Parameters

| Key     | Type   | Description |
| ------- | ------ | ----------- |
| voteIdx | Number | 투표 고유값 |

### Response

| Key          | Type                                   | Description  |
| ------------ | -------------------------------------- | ------------ |
| idx          | Number                                 | 고유값       |
| voteName     | Number                                 | 이름         |
| candidates   | Array\<[Candidate](#candidate-model)\> | 후보자 목록  |
| totalVoteCnt | Number                                 | 총 투표 개수 |
| startTime    | Timestamp                              | 시작 시간    |
| endTime      | Timestamp                              | 끝 시간      |
| status       | VoteStatus                             | 상태         |

<br></br>

## POST - Get My Vote In Progress

```
~/vote/get-my-vote-in-progress
```

진행중인 투표 중 유저가 참여한 투표의 목록을 반환합니다.

### Parameters

없음

### Response

| Key  | Type                         | Description |
| ---- | ---------------------------- | ----------- |
| list | Array\<[Vote](#vote-model)\> | 투표 목록   |

<br></br>

## POST - Get Past Vote Result

```
~/vote/get-past-vote-result
```

지난 투표의 목록을 반환합니다.

### Parameters

| Key  | Type   | Description      |
| ---- | ------ | ---------------- |
| page | Number | 조회할 페이지    |
| name | String | 검색할 투표 이름 |
| year | Number | 검색할 투표 연도 |

### Response

| Key        | Type                         | Description  |
| ---------- | ---------------------------- | ------------ |
| list       | Array\<[Vote](#vote-model)\> | 투표 목록    |
| totalCount | Number                       | 총 투표 개수 |

<br></br>

## POST - Decode Vote Receipt

```
~/vote/decode-vote-receipt
```

투표 코드를 디코딩하여 사용자의 투표 정보를 반환합니다.

### Parameters

| Key             | Type   | Description |
| --------------- | ------ | ----------- |
| transactionHash | String | 투표 코드   |

### Response

| Key      | Type    | Description                 |
| -------- | ------- | --------------------------- |
| voteName | String  | 투표 이름                   |
| candName | String  | 사용자가 선택한 후보자 이름 |
| renounce | Boolean | 기권 여부                   |

<br></br>

## POST - Add Vote

```
~/vote/add-vote
```

투표를 추가합니다. 스마트 컨트랙트를 호출하여 블록체인에 기록합니다.

### Parameters

| Key       | Type      | Description |
| --------- | --------- | ----------- |
| category  | Number    | 투표 분류   |
| voteName  | String    | 투표 이름   |
| startTime | Timestamp | 시작 시간   |
| endTime   | Timestamp | 끝 시간     |

### Response

| Key        | Type       | Description  |
| ---------- | ---------- | ------------ |
| idx        | Number     | 고유값       |
| category   | Number     | 분류         |
| voteName   | String     | 이름         |
| totalCount | String     | 총 투표 개수 |
| startTime  | Timestamp  | 시작 시간    |
| endTime    | Timestamp  | 끝 시간      |
| status     | VoteStatus | 상태         |

<br></br>

## POST - Update Vote

```
~/vote/update-vote
```

투표를 수정합니다. 진행중이거나 완료된 투표는 수정할 수 없습니다.

### Parameters

| Key       | Type       | Description |
| --------- | ---------- | ----------- |
| idx       | Number     | 고유값      |
| category  | Number     | 분류        |
| voteName  | String     | 이름        |
| startTime | Timestamp  | 시작 시간   |
| endTime   | Timestamp  | 끝 시간     |
| status    | VoteStatus | 상태        |

### Response

| Key    | Type    | Description |
| ------ | ------- | ----------- |
| result | Boolean | 결과        |

<br></br>

## POST - Add Candidate

```
~/vote/add-candidate
```

후보자를 추가합니다. 스마트 컨트랙트를 호출하여 블록체인에 기록합니다.

### Parameters

| Key      | Type   | Description |
| -------- | ------ | ----------- |
| voteIdx  | Number | 투표 고유값 |
| candName | String | 후보자 이름 |

### Response

| Key      | Type   | Description   |
| -------- | ------ | ------------- |
| idx      | Number | 후보자 고유값 |
| candName | String | 이름          |
| photo    | String | 사진 링크     |
| img      | String | 공약 링크     |
| txt      | String | 공약 글       |

<br></br>

## POST - Update Candidate

```
~/vote/update-candidate
```

후보자를 수정합니다. 진행중이거나 완료된 투표의 후보자는 수정할 수 없습니다.

### Parameters

| Key       | Type            | Description |
| --------- | --------------- | ----------- |
| candIdx   | Number          | 고유값      |
| category  | String          | 분류        |
| voteName  | String          | 이름        |
| startTime | Timestamp       | 시작 시간   |
| endTime   | Timestamp       | 끝 시간     |
| status    | CandidateStatus | 상태        |

### Response

| Key    | Type    | Description |
| ------ | ------- | ----------- |
| result | Boolean | 결과        |

<br></br>
<br></br>

# Models

## Vote Model

투표 모델

| Key        | Type       | Description  |
| ---------- | ---------- | ------------ |
| idx        | Number     | 고유값       |
| category   | Number     | 분류         |
| name       | String     | 이름         |
| totalCount | Number     | 투표 총 개수 |
| startTime  | Timestamp  | 시작 시간    |
| endTime    | Timestamp  | 끝 시간      |
| status     | VoteStatus | 상태         |

<br></br>

## Candidate Model

후보자 모델

| Key     | Type            | Description |
| ------- | --------------- | ----------- |
| idx     | Number          | 고유값      |
| voteIdx | Number          | 투표 고유값 |
| name    | String          | 이름        |
| photo   | String          | 사진 링크   |
| img     | String          | 공약 링크   |
| txt     | String          | 공약 글     |
| count   | Number          | 투표 개수   |
| status  | CandidateStatus | 상태        |

<br></br>
